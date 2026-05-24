QRVideoPatch =
  updateNotice: (post, message, type) ->
    notice = post._videoNotice
    if !notice
      post._videoNotice = notice = new Notice(type or 'info', message)
      return notice
    notice.setType(type) if type
    if notice.el?.lastElementChild
      notice.el.lastElementChild.textContent = ''
      $.add notice.el.lastElementChild, $.tn(message)
    notice

  closeNotice: (post) ->
    if post._videoNotice
      post._videoNotice.close()
      delete post._videoNotice

  readMp4Type: (bytes, start) ->
    String.fromCharCode(bytes[start], bytes[start + 1], bytes[start + 2], bytes[start + 3])

  readMp4Box: (bytes, view, offset, end) ->
    return null if offset + 8 > end
    size = view.getUint32(offset, false)
    header = 8
    if size is 1
      return null if offset + 16 > end
      high = view.getUint32(offset + 8, false)
      low = view.getUint32(offset + 12, false)
      return null if high
      size = low
      header = 16
    else if size is 0
      size = end - offset
    return null if size < header or offset + size > end
    {
      start: offset
      type: QRVideoPatch.readMp4Type(bytes, offset + 4)
      dataStart: offset + header
      end: offset + size
      size
    }

  mp4TrackIsAudio: (bytes, view, trak) ->
    pos = trak.dataStart
    while pos < trak.end
      box = QRVideoPatch.readMp4Box(bytes, view, pos, trak.end)
      break unless box and box.end > pos
      if box.type is 'mdia'
        mdiaPos = box.dataStart
        while mdiaPos < box.end
          child = QRVideoPatch.readMp4Box(bytes, view, mdiaPos, box.end)
          break unless child and child.end > mdiaPos
          if child.type is 'hdlr' and child.dataStart + 12 <= child.end
            return true if QRVideoPatch.readMp4Type(bytes, child.dataStart + 8) is 'soun'
          mdiaPos = child.end
      pos = box.end
    false

  stripMp4AudioBytes: (bytes, view) ->
    patched = false
    pos = 0
    while pos < bytes.length
      box = QRVideoPatch.readMp4Box(bytes, view, pos, bytes.length)
      break unless box and box.end > pos
      if box.type is 'moov'
        moovPos = box.dataStart
        while moovPos < box.end
          child = QRVideoPatch.readMp4Box(bytes, view, moovPos, box.end)
          break unless child and child.end > moovPos
          if child.type is 'trak' and QRVideoPatch.mp4TrackIsAudio(bytes, view, child)
            bytes[child.start + 4] = 0x66 # f
            bytes[child.start + 5] = 0x72 # r
            bytes[child.start + 6] = 0x65 # e
            bytes[child.start + 7] = 0x65 # e
            patched = true
          moovPos = child.end
      pos = box.end
    patched

  readVint: (bytes, offset, includeMarker) ->
    return null if offset >= bytes.length
    first = bytes[offset]
    mask = 0x80
    length = 1
    while length <= 8 and !(first & mask)
      mask >>= 1
      length++
    return null if length > 8 or offset + length > bytes.length
    value = if includeMarker then first else first & (mask - 1)
    for i in [1...length]
      value = value * 256 + bytes[offset + i]
    {length, value}

  readElement: (bytes, offset, end) ->
    id = QRVideoPatch.readVint(bytes, offset, true)
    return null unless id
    size = QRVideoPatch.readVint(bytes, offset + id.length, false)
    return null unless size
    header = id.length + size.length
    dataStart = offset + header
    dataEnd = dataStart + size.value
    dataEnd = end if dataEnd > end
    {
      id: id.value
      start: offset
      header
      dataStart
      dataEnd
      end: dataEnd
      sizeUnknown: size.value is Math.pow(2, 7 * size.length) - 1
    }

  makeEbmlSize: (value, length) ->
    bytes = new Uint8Array(length)
    for i in [length - 1..0]
      bytes[i] = value % 256
      value = Math.floor(value / 256)
    bytes[0] |= 1 << (8 - length)
    bytes

  makeVoid: (length) ->
    return null if length < 2
    for sizeLength in [1..8]
      payloadLength = length - 1 - sizeLength
      continue if payloadLength < 0
      maxValue = Math.pow(2, 7 * sizeLength) - 2
      continue if payloadLength > maxValue
      bytes = new Uint8Array(length)
      bytes[0] = 0xEC
      bytes.set QRVideoPatch.makeEbmlSize(payloadLength, sizeLength), 1
      return bytes
    null

  voidElement: (bytes, element) ->
    replacement = QRVideoPatch.makeVoid(element.end - element.start)
    return false unless replacement
    bytes.set replacement, element.start
    true

  readUnsigned: (bytes, start, end) ->
    value = 0
    for i in [start...end]
      value = value * 256 + bytes[i]
    value

  getWebMTrackNumber: (bytes, offset) ->
    track = QRVideoPatch.readVint(bytes, offset, false)
    track?.value

  parseWebMTrackEntry: (bytes, entry) ->
    pos = entry.dataStart
    trackNumber = null
    trackType = null
    while pos < entry.dataEnd
      child = QRVideoPatch.readElement(bytes, pos, entry.dataEnd)
      break unless child and child.end > pos
      switch child.id
        when 0xD7
          trackNumber = QRVideoPatch.readUnsigned(bytes, child.dataStart, child.dataEnd)
        when 0x83
          trackType = QRVideoPatch.readUnsigned(bytes, child.dataStart, child.dataEnd)
      pos = child.end
    {trackNumber, trackType}

  collectWebMAudioTracks: (bytes, tracks) ->
    audioTracks = []
    audioEntries = []
    pos = tracks.dataStart
    while pos < tracks.dataEnd
      entry = QRVideoPatch.readElement(bytes, pos, tracks.dataEnd)
      break unless entry and entry.end > pos
      if entry.id is 0xAE
        parsed = QRVideoPatch.parseWebMTrackEntry(bytes, entry)
        if parsed.trackType is 2 and parsed.trackNumber?
          audioTracks.push parsed.trackNumber
          audioEntries.push entry
      pos = entry.end
    {audioTracks, audioEntries}

  stripWebMAudio: (post, file, done) ->
    unless /\.webm$/i.test(file.name or '') or /^video\/webm$/i.test(file.type or '')
      done(null, null, 'unsupported')
      return
    reader = new FileReader()
    reader.onerror = ->
      done(reader.error or new Error('Failed to read video for audio stripping.'))
    reader.onload = ->
      try
        bytes = new Uint8Array(reader.result)
        patched = false
        pos = 0
        while pos < bytes.length
          el = QRVideoPatch.readElement(bytes, pos, bytes.length)
          break unless el and el.end > pos
          if el.id is 0x18538067
            segmentEnd = if el.sizeUnknown then bytes.length else el.dataEnd
            segmentPos = el.dataStart
            while segmentPos < segmentEnd
              segmentEl = QRVideoPatch.readElement(bytes, segmentPos, segmentEnd)
              break unless segmentEl and segmentEl.end > segmentPos
              if segmentEl.id is 0x1654AE6B
                trackPos = segmentEl.dataStart
                while trackPos < segmentEl.dataEnd
                  entry = QRVideoPatch.readElement(bytes, trackPos, segmentEl.dataEnd)
                  break unless entry and entry.end > trackPos
                  if entry.id is 0xAE
                    parsed = QRVideoPatch.parseWebMTrackEntry(bytes, entry)
                    if parsed.trackType is 2
                      bytes[entry.start] = 0xEC
                      patched = true
                  trackPos = entry.end
                break
              segmentPos = segmentEl.end
            break
          pos = el.end
        unless patched
          done(null, null, 'noaudio')
          return
        QRVideoPatch.updateNotice(post, 'Audio stripped.', 'success')
        done(null, new File([bytes], file.name, {type: file.type or 'video/webm'}), 'stripped')
      catch err
        done(err)
    reader.readAsArrayBuffer(file)

  stripMp4Audio: (post, file, done) ->
    unless /\.mp4$/i.test(file.name or '') or /^video\/mp4$/i.test(file.type or '')
      done(null, null, 'unsupported')
      return
    reader = new FileReader()
    reader.onerror = ->
      done(reader.error or new Error('Failed to read video for audio stripping.'))
    reader.onload = ->
      try
        buffer = reader.result
        bytes = new Uint8Array(buffer)
        view = new DataView(buffer)
        unless QRVideoPatch.stripMp4AudioBytes(bytes, view)
          done(null, null, 'noaudio')
          return
        QRVideoPatch.updateNotice(post, 'Audio stripped.', 'success')
        done(null, new File([bytes], file.name, {type: file.type or 'video/mp4'}), 'stripped')
      catch err
        done(err)
    reader.readAsArrayBuffer(file)

  stripAudio: (post, file, done) ->
    if /\.mp4$/i.test(file.name or '') or /^video\/mp4$/i.test(file.type or '')
      QRVideoPatch.stripMp4Audio(post, file, done)
    else
      QRVideoPatch.stripWebMAudio(post, file, done)

  stripCommand: (file) ->
    if /\.mp4$/i.test(file.name or '') or /^video\/mp4$/i.test(file.type or '')
      'ffmpeg -i input.mp4 -c:v copy -an fixed.mp4'
    else
      'ffmpeg -i input.webm -c:v copy -an fixed.webm'

do ->
  proto = QR.post and QR.post.prototype
  return unless proto

  isLikelyVideo = (file) ->
    return false unless file
    return true if /^video\//i.test(file.type or '')
    /\.(webm|mp4)$/i.test(file.name or '')

  origSetFile = proto.setFile
  origRm = proto.rm
  origDelete = proto.delete
  origRmFile = proto.rmFile
  origSubmit = QR.submit

  proto.cancelVideoProcessing = (message, silent) ->
    if @_videoProcessing and @_videoProcessing.stop
      @_videoProcessing.cancelled = true
      @_videoProcessing.stop()
      delete @_videoProcessing
    delete @_pendingFile
    unless @file
      $.rmClass @nodes.el, 'has-file'
      @nodes.el.removeAttribute 'title'
      @nodes.span.textContent = @com or ''
    QRVideoPatch.closeNotice(@)
    if !silent and message
      QR.notifications.push(new Notice('info', message, 4))

  proto.setFile = (file) ->
    post = @
    post._videoTaskID = (post._videoTaskID or 0) + 1
    taskID = post._videoTaskID
    post.cancelVideoProcessing(null, true)

    unless isLikelyVideo(file)
      return origSetFile.call(post, file)

    unless BoardConfig.noAudio(g.BOARD.ID)
      return origSetFile.call(post, file)

    unless Conf['Strip Video Audio']
      return origSetFile.call(post, file)

    post.filename = file.name
    post._pendingFile = true
    $.addClass post.nodes.el, 'has-file'
    post.nodes.el.title = file.name
    post.nodes.span.textContent = file.name
    QR.updatePreviewStrip?()
    QRVideoPatch.updateNotice(post, 'Removing audio...', 'info')
    post._videoProcessing =
      stop: ->
        QRVideoPatch.closeNotice(post)
      cancelled: false
    QRVideoPatch.stripAudio post, file, (err, outFile, status) ->
      return unless post._videoTaskID is taskID
      delete post._videoProcessing
      delete post._pendingFile
      if err
        QRVideoPatch.closeNotice(post)
        unless post.file
          $.rmClass post.nodes.el, 'has-file'
        post.fileError(err.message or String(err))
        return
      if outFile
        setTimeout((-> QRVideoPatch.closeNotice(post)), 1000)
        outFile._qrAudioStripped = true
        origSetFile.call(post, outFile)
      else if !status? or status in ['noaudio', 'unsupported']
        QRVideoPatch.closeNotice(post)
        origSetFile.call(post, file)
      else
        QRVideoPatch.closeNotice(post)
        unless post.file
          $.rmClass post.nodes.el, 'has-file'
        post.fileError("Could not strip audio in browser. Use: #{QRVideoPatch.stripCommand(file)}")

  proto.rm = ->
    @cancelVideoProcessing(null, true)
    origRm.apply(@, arguments)

  proto.delete = ->
    @cancelVideoProcessing(null, true)
    origDelete.apply(@, arguments)

  proto.rmFile = ->
    @cancelVideoProcessing(null, true)
    origRmFile.apply(@, arguments)

  QR.submit = (e) ->
    if QR.selected and QR.selected._videoProcessing
      e?.preventDefault?()
      QR.selected.cancelVideoProcessing('Video processing canceled.')
      return
    origSubmit.apply(@, arguments)
