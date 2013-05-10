<% if (type === 'userjs') { %>
# Opera doesn't support the @match metadata key,
# return 4chan X here if we're not on 4chan.
return unless /^[a-z]+\.4chan\.org$/.test location.hostname
<% } %>

editTheme = {} # Currently editted theme.
editMascot = {} # Which mascot we're editting.
userNavigation = {} # ...
Conf = {}
c    = console
d    = document
doc  = d.documentElement
g    =
  VERSION:   '<%= version %>'
  NAMESPACE: '<%= meta.name.replace(' ', '_') %>.'
  TYPE:      'sfw'
  boards:    {}
  threads:   {}
  posts:     {}

MutationObserver = window.MutationObserver or window.WebKitMutationObserver or window.OMutationObserver

Mascots =
  'Akiyama_Mio':
    category:   'Anime'
    image:      'https://i.minus.com/ibrWLbKvjRnHZS.png'
  'Akiyama_Mio_2':
    category:   'Anime'
    image:      'https://i.minus.com/ibmZgHvl3ZSxYk.png'
  'Akiyama_Mio_3':
    category:   'Anime'
    image:      'https://i.minus.com/irFbpefCFt1cT.png'
    center:     true
  'Akiyama_Mio_sitting':
    category:   'Questionable'
    image:      'https://i.minus.com/ibnnAPmolhTfE7.png'
  'Anime_Girl_in_Bondage':
    category:   'Questionable'
    image:      'https://i.minus.com/ibbfIrZEoNLmiU.png'
    center:     true
  'Anime_Girl_in_Bondage_2':
    category:   'Questionable'
    image:      'http://i.minus.com/iGRED5sHh4RMs.png'
    center:     true
  'Applejack':
    category:   'Ponies'
    image:      'https://i.minus.com/inZ8jSVsEhfnC.png'
    center:     true
  'Asuka_Langley_Soryu':
    category:   'Anime'
    image:      'https://i.minus.com/ib2z9ME9QKEBaS.png'
    center:     true
  'Asuka_Langley_Soryu_2':
    category:   'Anime'
    image:      'https://i.minus.com/iI3QR5SywNfg9.png'
    center:     true
  'Asuka_Langley_Soryu_3':
    category:   'Anime'
    image:      'https://i.minus.com/ibwjj4dLtiADla.png'
    center:     true
  'Asuka_Langley_Soryu_4':
    category:   'Anime'
    image:      'https://i.minus.com/ibiiInQGLGnYNj.png'
    center:     true
  'Asuka_Langley_Soryu_5':
    category:   'Questionable'
    image:      'https://i.minus.com/iJq4VXY1Gw8ZE.png'
    center:     true
  'Asuka_Langley_Soryu_6':
    category:   'Anime'
    image:      'https://i.minus.com/ibzbnBcaEtoqck.png'
    position:   'bottom'
  'Ayanami_Rei':
    category:   'Anime'
    image:      'https://i.minus.com/ib0ft5OmqRZx2r.png'
    center:     true
  'Ayase_Yue':
    category:   'Questionable'
    image:      'https://i.minus.com/ign5fGOZWTx5o.png'
  'Ayase':
    category:   'Anime'
    image:      'https://i.minus.com/ibmArq5Wb4Po4v.png'
    center:     true
  'Ayase_2':
    category:   'Questionable'
    image:      'https://i.minus.com/ibjUbDLSU5pwhK.png'
    center:     true
  'BLACK_ROCK_SHOOTER':
    category:   'Anime'
    image:      'https://i.minus.com/ibMe9MrTMdvAT.png'
    center:     true
  'Blue_Rose':
    category:   'Questionable'
    image:      'https://i.minus.com/ibiq1joMemfzeM.png'
    center:     true
  'Brioche_d_Arquien':
    category:   'Anime'
    image:      'https://i.minus.com/ibobXYJ2k3JXK.png'
    center:     true
  'CC':
    category:   'Anime'
    image:      'https://i.minus.com/iwndO4Pn6SO0X.png'
    center:     true
  'CC2':
    category:   'Questionable'
    image:      'https://i.minus.com/iVT3TjJ7lBRpl.png'
    center:     true
  'Chie':
    category:   'Anime'
    image:      'https://i.minus.com/ib0HI16h9FSjSp.png'
    center:     true
  'Cirno':
    category:   'Questionable'
    image:      'https://i.minus.com/ibffjW5v0zrSGa.png'
    center:     true
  'Cirno_2':
    category:   'Anime'
    image:      'https://i.minus.com/iSZ06ZxrcqAKq.png'
    center:     true
  'Dawn_Hikari':
    category:   'Anime'
    image:      'https://i.minus.com/iL3J1EmcDkFzE.png'
    center:     true
  'Doppleganger':
    category:   'Anime'
    image:      'https://i.minus.com/iPvv86W9r3Rxm.png'
  'Dragonkid':
    category:   'Anime'
    image:      'https://i.minus.com/iq9fuyWSjIDWf.png'
    center:     true
  'Dragonkid_2':
    category:   'Anime'
    image:      'https://i.minus.com/i7sdxK3G12RB6.png'
    center:     true
  'Eclair':
    category:   'Anime'
    image:      'https://i.minus.com/ibsk5mMYVR5zuA.png'
    center:     true
  'Erio_Touwa':
    category:   'Questionable'
    image:      'https://i.minus.com/in8bF152Y9qVB.png'
  'Evangeline_AK_McDowell':
    category:   'Anime'
    image:      'https://i.minus.com/ibuq7a8zWKi2gl.png'
    center:     true
  'Fluttershy':
    category:   'Ponies'
    image:      'https://i.minus.com/ibwEFEGlRm0Uxy.png'
  'Fluttershy_2':
    category:   'Ponies'
    image:      'https://i.minus.com/ibjtz6EU2OFPgh.png'
    center:     true
  'Fluttershy_Cutiemark':
    category:   'Ponies'
    image:      'https://i.minus.com/i5WVpIAlHQdhs.png'
    center:     true
  'Fujiwara_no_Mokou':
    category:   'Anime'
    image:      'https://i.minus.com/ibpwDyMGodvni6.png'
  'Furudo_Erika':
    category:   'Anime'
    image:      'https://i.minus.com/iCrRzQ8WvHiSM.png'
    center:     true
  'Gally':
    category:   'Anime'
    image:      'https://i.minus.com/iblWZGuSlWtDI6.png'
    center:     true
  'Gasai_Yuno':
    category:   'Anime'
    image:      'https://i.minus.com/iEQsK6K85jX2n.png'
  'Gasai_Yuno_2':
    category:   'Questionable'
    image:      'https://i.minus.com/ifyPk7Yeo1JA7.png'
  'George_Costanza':
    category:   'Western'
    image:      'https://i.minus.com/iFWdpFGfzLs6v.png'
  'Hanako':
    category:   'Anime'
    image:      'https://i.minus.com/iRLF8gCIZbGjo.png'
    center:     true
  'Hasekura_Youko':
    category:   'Anime'
    image:      'https://i.minus.com/iqBTFZf5UhLpR.png'
    center:     true
  'Hatsune_Miku':
    category:   'Questionable'
    image:      'https://i.minus.com/iHuUwYVywpp3Z.png'
  'Hatsune_Miku_2':
    category:   'Questionable'
    image:      'https://i.minus.com/iclhgYeHDD77I.png'
    center:     true
  'Hatsune_Miku_3':
    category:   'Anime'
    image:      'https://i.minus.com/iLJ4uDTcg1T8r.png'
    center:     true
  'Hatsune_Miku_4':
    category:   'Anime'
    image:      'https://i.minus.com/ibjkPMLT8Uxitp.png'
    center:     true
  'Hatsune_Miku_5':
    category:   'Anime'
    image:      'https://i.minus.com/i9Evu9dyvok4G.png'
    center:     true
  'Hatsune_Miku_6':
    category:   'Questionable'
    image:      'https://i.minus.com/iQzx9fPFgPUNl.png'
    center:     true
  'Hatsune_Miku_7':
    category:   'Questionable'
    image:      'https://i.minus.com/iDScshaEZqUuy.png'
    center:     true
  'Hirasawa_Yui':
    category:   'Anime'
    image:      'https://i.minus.com/iuGe5uDaTNmhR.png'
    center:     true
  'Homura_Akemi':
    category:   'Anime'
    image:      'https://i.minus.com/iPtrwFEEtPLhn.png'
  'Horo':
    category:   'Silhouette'
    image:       ['https://i.minus.com/i429JguITUibN.png', 'https://i.minus.com/icpvfMuZEQCtS.png']
  'Horo_2':
    category:   'Silhouette'
    image:       ['https://i.minus.com/ibv270koIdRjm7.png', 'https://i.minus.com/iPM4lDD53yB5n.png']
  'Horo_3':
    category:   'Questionable'
    image:      'http://i.minus.com/ibyT9dlTe1HN5P.png'
  'Horo_4':
    category:   'Questionable'
    image:      'http://i.minus.com/ibbMKiznORGJ00.png'
  'Ika_Musume':
    category:   'Anime'
    image:      'https://i.minus.com/ibqVu5GNfKx5bC.png'
    center:     true
  'Ika_Musume_2':
    category:   'Anime'
    image:      'https://i.minus.com/ibhnEiE8HabEqC.png'
    center:     true
  'Ika_Musume_3':
    category:   'Questionable'
    image:      'https://i.minus.com/iby8LyjXffukaI.png'
    center:     true
  'Inori':
    category:   'Questionable'
    image:      'https://i.minus.com/ibpHKNPxcFqRxs.png'
  'Inori_2':
    category:   'Questionable'
    image:      'https://i.minus.com/ibzM531DBaHYXD.png'
  'Iwakura_Lain':
    category:   'Anime'
    image:      'https://i.minus.com/iBXRRT19scoHf.png'
    center:     true
  'Iwakura_Lain_2':
    category:   'Anime'
    image:      'https://i.minus.com/ioMltWNYUWeJ3.png'
    center:     true
  'KOn_Girls':
    category:   'Anime'
    image:      'https://i.minus.com/ibndVLiH09uINs.png'
    center:     true
  'Kagamine_Rin':
    category:   'Questionable'
    image:      'https://i.minus.com/iVPKJeDXKPKeV.png'
    center:     true
  'Kagamine_Rin_2':
    category:   'Anime'
    image:      'https://i.minus.com/jbkL01TIeJwEN6.png'
  'Kagari_Izuriha':
    category:   'Anime'
    image:      'https://i.minus.com/ihaFHsvFfL0vH.png'
  'Kaname_Madoka':
    category:   'Anime'
    image:      'https://i.minus.com/iRuEFK8cdAHxB.png'
    center:     true
  'Karina':
    category:   'Anime'
    image:      'https://i.minus.com/iUADBOpQYPfeP.png'
    center:     true
  'Kigurumi_Harokitei':
    category:   'Anime'
    image:      'https://i.minus.com/ibb17W5i3rQvut.png'
    center:     true
  'Kinomoto_Sakura':
    category:   'Anime'
    image:      'https://i.minus.com/iVmsLKa4zLwZR.png'
    center:     true
  'Kinomoto_Sakura_2':
    category:   'Questionable'
    image:      'https://i.minus.com/ibklztjz3Ua747.png'
    center:     true
  'Kirisame_Marisa':
    category:   'Anime'
    image:      'https://i.minus.com/ibikDZH5CZ0V30.png'
  'Kirino_Kosaka_and_Ruri_Goko':
    category:   'Questionable'
    image:      'https://i.minus.com/isIzggtfUo4ql.png'
    center:     true
  'Koiwai_Yotsuba':
    category:   'Anime'
    image:      'https://i.minus.com/iKFKyVVBato2N.png'
    center:     true
  'Koko':
    category:   'Anime'
    image:      'https://i.minus.com/ieVyNMSjXpBs2.png'
    center:     true
  'Konjiki_no_Yami':
    category:   'Questionable'
    image:      'https://i.minus.com/imy7iv5fuym8b.png'
    position:   'bottom'
  'Kotobuki_Tsumugi':
    category:   'Anime'
    image:      'https://i.minus.com/i6doAUnM6jMAY.png'
    center:     true
  'Kurisu_Makise':
    category:   'Anime'
    image:      'https://i.minus.com/ib1eMtRHdvc9ix.png'
  'Kuroko_Shirai':
    category:   'Anime'
    image:      'https://i.minus.com/i3K8F7lu2SHfn.png'
  'Kyouko_Sakura':
    category:   'Anime'
    image:      'https://i.minus.com/iMrFOS1mfzIJP.png'
    center:     true
  'Kyubee':
    category:   'Anime'
    image:      'https://i.minus.com/iD0SEJPeZa0Dw.png'
  'Kyubee_2':
    category:   'Anime'
    image:      'https://i.minus.com/iGlKiDZvM3xi8.png'
    center:     true
  'Leonmitchelli':
    category:   'Questionable'
    image:      'https://i.minus.com/ibgUFGlOpedfbs.png'
    center:     true
  'Li_Syaoran':
    category:   'Anime'
    image:      'https://i.minus.com/ib0IWPBRSHyiDe.png'
  'Link':
    category:   'Anime'
    image:      'https://i.minus.com/ibd1JShAMTdJBH.png'
    center:     true
  'Lizardgirl':
    category:   'Anime'
    image:      'https://i.minus.com/is7h27Q6lsmyx.png'
  'Luka':
    category:   'Anime'
    image:      'https://i.minus.com/inds5h2BOmVBy.png'
  'Madotsuki':
    category:   'Anime'
    image:      'https://i.minus.com/ik6QYfTfgx9Za.png'
  'Makoto':
    category:   'Anime'
    image:      'https://i.minus.com/i7q6aOuUqqA9F.png'
    center:     true
  'Mantis':
    category:   'Anime'
    image:      'https://i.minus.com/iBmluUJOZivY2.png'
  'Megurine_Luka':
    category:   'Anime'
    image:      'https://i.minus.com/ibxe63yidpz9Gz.png'
    center:     true
  'Mei_Sunohara':
    category:   'Anime'
    image:      'https://i.minus.com/i7ElzNY4xQHHz.png'
    center:     true
  'Millefiori':
    category:   'Anime'
    image:      'https://i.minus.com/ifVzPtH8JHXjl.png'
    center:     true
  'Millefiori_2':
    category:   'Anime'
    image:      'https://i.minus.com/iMSUiQxRBylQG.png'
    center:     true
  'Millefiori_3':
    category:   'Anime'
    image:      'https://i.minus.com/iDOe3ltSvOYXZ.png'
    center:     true
  'Misaki_Mei':
    category:   'Anime'
    image:      'https://i.minus.com/icmYGJ9vIOFjr.png'
    center:     true
  'Mizunashi_Akari':
    category:   'Anime'
    image:      'https://i.minus.com/iNy9kHlNsUoVK.png'
    center:     true
  'Motoko':
    category:   'Anime'
    image:      'https://i.minus.com/irFtkWWyMChSA.png'
    center:     true
  'Nagato_Yuki':
    category:   'Anime'
    image:      'https://i.minus.com/it3pEawWIxY84.png'
    center:     true
  'Nagato_Yuki_2':
    category:   'Anime'
    image:      'https://i.minus.com/iuspcZbLvmqpb.png'
    center:     true
  'Nagato_Yuki_3':
    category:   'Anime'
    image:      'https://i.minus.com/ibndIkldw4njbD.png'
    center:     true
  'Nagato_Yuki_4':
    category:   'Questionable'
    image:      'https://i.minus.com/i92tUr90OVZGD.png'
    center:     true
  'Nagato_Yuki_5':
    category:   'Silhouette'
    image:       ['https://i.minus.com/iW0iHUkHwu44d.png', 'https://i.minus.com/i859zL9JXZLbD.png']
    center:     true
  'Nagato_Yuki_6':
    category:   'Silhouette'
    image:       ['https://i.minus.com/iJdxNEMekrQjp.png', 'https://i.minus.com/ibbHeuocMgN5Eu.png']
    center:     true
  'Nagato_Yuki_7':
    category:   'Questionable'
    image:      'http://i.minus.com/iFQQPEaC3aEV7.png'
  'Nakano_Azusa':
    category:   'Anime'
    image:      'https://i.minus.com/iiptfoMlr4v1k.png'
  'Nodoka_Miyazaki':
    category:   'Questionable'
    image:      'http://i.minus.com/iDX5mImKBzrXK.png'
  'Nichijou':
    category:   'Anime'
    image:      'https://i.minus.com/iE8lbZ5f3OT2B.png'
  'Noir_VinoCacao':
    category:   'Anime'
    image:      'https://i.minus.com/ibo8aCWF0OwNwP.png'
    center:     true
  'Pinkie_Pie':
    category:   'Ponies'
    image:      'https://i.minus.com/ib1kcpqxvsyZWG.png'
    center:     true
  'Pinkie_Pie_2':
    category:   'Ponies'
    image:      'https://i.minus.com/i8QRRgE7iKpw7.png'
    center:     true
  'Oshino_Shinobu':
    category:   'Anime'
    image:      'https://i.minus.com/ibwhAyR6D7OBAB.png'
  'Oshino_Shinobu_2':
    category:   'Anime'
    image:      'https://i.minus.com/ibqoNiWzynsVvg.png'
    position:   'bottom'
  'Patchouli_Knowledge':
    category:   'Anime'
    image:      'https://i.minus.com/ibnOEAxXaKlctB.png'
    center:     true
  'Patchouli_Knowledge_2':
    category:   'Anime'
    image:      'https://i.minus.com/i1MOPTmohOsMD.png'
  'Pink_Doggy':
    category:   'Anime'
    image:      'https://i.minus.com/i1SpWAzfcIEQc.png'
    center:     true
  'Pink_Hair':
    category:   'Anime'
    image:      'https://i.minus.com/ibdwMaIPwdscao.png'
    center:     true
  'Pixie':
    category:   'Questionable'
    image:      'https://i.minus.com/ipRzX1YsTyhgZ.png'
    center:     true
  'Railgun':
    category:   'Questionable'
    image:      'https://i.minus.com/iysolfmvz6WKs.png'
    center:     true
  'Railgun_2':
    category:   'Anime'
    image:      'https://i.minus.com/iNhpDDO0GSTeM.png'
    center:     true
  'Railgun_3':
    category:   'Anime'
    image:      'https://i.minus.com/iiW02dmqUwRcy.png'
  'Railgun_4':
    category:   'Anime'
    image:      'https://i.minus.com/iR3j0mGgd1927.png'
    center:     true
  'Rainbow_Dash':
    category:   'Ponies'
    image:      'https://i.minus.com/ibthr5EDMZHV9j.png'
    center:     true
  'Rarity':
    category:   'Ponies'
    image:      'https://i.minus.com/ibkraGhhUh25CU.png'
    center:     true
  'Revi':
    category:   'Anime'
    image:      'https://i.minus.com/ivUMKcy5ow6Ab.png'
    position:   'bottom'
    center:     true
  'Ruri_Gokou':
    category:   'Anime'
    image:      'https://i.minus.com/ibtZo1fdOk8NCB.png'
    position:   'bottom'
    center:     true
  'Ryuu':
    category:   'Anime'
    image:      'https://i.minus.com/iecVz4p2SuqK4.png'
    position:   'bottom'
  'Saber':
    category:   'Questionable'
    image:      'https://i.minus.com/i62cv3csQaqgk.png'
    center:     true
  'Sakurazaki_Setsuna':
    category:   'Questionable'
    image:      'https://i.minus.com/iHS6559NMU1tS.png'
  'Samus_Aran':
    category:   'Anime'
    image:      'https://i.minus.com/iWG1GFJ89A05p.png'
    center:     true
  'Samus_Aran_2':
    category:   'Anime'
    image:      'http://i.minus.com/ibl4efsNtHpkXg.png'
  'Seraphim':
    category:   'Questionable'
    image:      'https://i.minus.com/ivHaKIFHRpPFP.png'
    center:     true
  'Shana':
    category:   'Anime'
    image:      'https://i.minus.com/ib2cTJMF0cYIde.png'
    center:     true
  'Shana_2':
    category:   'Anime'
    image:      'https://i.minus.com/ioRICGu0Ipzj9.png'
    center:     true
  'Shiki':
    category:   'Anime'
    image:      'https://i.minus.com/iIZm1JxxDIDQ1.png'
  'Shinji_and_Girls':
    category:   'Anime'
    image:      'https://i.minus.com/itMrEn56GzvzE.png'
    center:     true
  'Shinonome_Hakase':
    category:   'Anime'
    image:      'https://i.minus.com/iocCwDCnNgI19.png'
    center:     true
  'Shirakiin_Ririchiyo':
    category:   'Anime'
    image:      'https://i.minus.com/i1m0rdzmVLYLa.png'
    position:   'bottom'
    center:     true
  'Shirohibe':
    category:   'Anime'
    image:      'https://i.minus.com/iGu91k3KZeg00.png'
    position:   'bottom'
  'Suruga_Kanbaru':
    category:   'Anime'
    image:      'https://i.minus.com/irEL7AgC80qKD.png'
    center:     true
  'Suzumiya_Haruhi':
    category:   'Anime'
    image:      'https://i.minus.com/iM9qMfUNh9Qi9.png'
    center:     true
  'Suzumiya_Haruhi_2':
    category:   'Anime'
    image:      'https://i.minus.com/ibnomd5iasjceY.png'
    center:     true
  'Tardis':
    category:   'Western'
    image:      'https://i.minus.com/iQL2bwpDfOgk.png'
    center:     true
  'Teletha_Tessa_Testarossa':
    category:   'Questionable'
    image:      'https://i.minus.com/iQKrg7Pq7Y6Ed.png'
  'Rukia_Nia_and_Asa':
    category:   'Questionable'
    image:      'http://i.minus.com/icECBJR5D5U4S.png'
  'Tewi_Inaba':
    category:   'Anime'
    image:      'https://i.minus.com/ib2k9lwQIkmb66.png'
  'Tifa':
    category:   'Questionable'
    image:      'https://i.minus.com/inDzKQ0Wck4ef.png'
    center:     true
  'Tomozo_Kaoru':
    category:   'Anime'
    image:      'https://i.minus.com/islUcBaPRYAgv.png'
    center:     true
  'Twilight_Sparkle':
    category:   'Ponies'
    image:      'https://i.minus.com/ibnMYVTZEykrKU.png'
    center:     true
  'Udine':
    category:   'Questionable'
    image:      'https://i.minus.com/iiycujRmhn6QK.png'
    position:   'bottom'
  'Wanwan':
    category:   'Questionable'
    image:      'https://i.minus.com/iTdBWYMCXULLT.png'
    center:     true
  'White_Curious':
    category:   'Anime'
    image:      'https://i.minus.com/ibfkj5osu99axe.png'
    center:     true
  'Yakumo_Ran':
    category:   'Anime'
    image:      'https://i.minus.com/ivKqn8vL9A8cQ.png'
  'Yin':
    category:   'Anime'
    image:      'https://i.minus.com/iL9DlVtaAGFdq.png'
  'Yin_2':
    category:   'Anime'
    image:      'https://i.minus.com/izkTpyjr1XlLR.png'
    center:     true
  'Yoko_Littner':
    category:   'Questionable'
    image:      'https://i.minus.com/i0mtOEsBC9GlY.png'
  'Yoko_Littner_2':
    category:   'Anime'
    image:      'https://i.minus.com/i7aUDY4h9uB1T.png'
    center:     true
  'Yoko_Littner_3':
    category:   'Anime'
    image:      'https://i.minus.com/iYVd5DhCmB7VJ.png'
    center:     true
  'Yozora_Mikazuki':
    category:   'Anime'
    image:      'https://i.minus.com/iIFEsDzoDALQd.png'
  'Yuzuki_Yukari':
    category:   'Anime'
    image:      'https://i.minus.com/iYQOz0iGM9ygq.png'
    center:     true
  'Yukkikaze':
    category:   'Anime'
    image:      'https://i.minus.com/ioQJAnyXebHDJ.png'
    center:     true
  'Yukkihaze_2':
    category:   'Anime'
    image:      'https://i.minus.com/inpgaDlJtZ9Sc.png'
    center:     true

Themes =
  'AppChan':
    'Author'                      : 'Zixaphir'
    'Author Tripcode'             : '!..NoTrip..'
    'Background Color'            : 'rgba(44,44,44,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Dialog Background'           : 'rgba(44,44,44,1)'
    'Dialog Border'               : 'rgba(44,44,44,1)'
    'Reply Background'            : 'rgba(51,51,51,1)'
    'Reply Border'                : 'rgba(51,51,51,1)'
    'Highlighted Reply Background': 'rgba(57,57,57,1)'
    'Highlighted Reply Border'    : 'rgba(57,57,57,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Input Background'            : 'rgba(51,51,51,1)'
    'Input Border'                : 'rgba(51,51,51,1)'
    'Checkbox Background'         : 'rgba(68,68,68,1)'
    'Checkbox Border'             : 'rgba(68,68,68,1)'
    'Buttons Background'          : 'rgba(48,48,48,1)'
    'Buttons Border'              : 'rgba(48,48,48,1)'
    'Focused Input Background'    : 'rgba(63,63,63,1)'
    'Focused Input Border'        : 'rgba(63,63,63,1)'
    'Hovered Input Background'    : 'rgba(57,57,57,1)'
    'Hovered Input Border'        : 'rgba(57,57,57,1)'
    'Navigation Background'       : 'rgba(44,44,44,0.9)'
    'Navigation Border'           : 'rgba(44,44,44,0.9)'
    'Quotelinks'                  : 'rgb(79,95,143)'
    'Backlinks'                   : 'rgb(79,95,143)'
    'Links'                       : 'rgb(102,136,170)'
    'Hovered Links'               : 'rgb(78,110,142)'
    'Navigation Links'            : 'rgb(170,170,170)'
    'Hovered Navigation Links'    : 'rgb(78,110,142)'
    'Names'                       : 'rgb(170,170,170)'
    'Tripcodes'                   : 'rgb(170,170,170)'
    'Emails'                      : 'rgb(102,136,170)'
    'Subjects'                    : 'rgb(144,144,144)'
    'Text'                        : 'rgb(170,170,170)'
    'Inputs'                      : 'rgb(170,170,170)'
    'Post Numbers'                : 'rgb(102,136,170)'
    'Greentext'                   : 'rgb(120,153,34)'
    'Sage'                        : 'rgb(150,150,150)'
    'Board Title'                 : 'rgb(170,170,170)'
    'Timestamps'                  : 'rgb(170,170,170)'
    'Warnings'                    : 'rgb(102,136,170)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : ''

  'BakaBT':
    'Author'                      : 'seaweed'
    'Author Tripcode'             : '!POMF.9waa'
    'Background Image'            : 'url("http://i.imgur.com/rTkxi.jpg")'
    'Background Attachment'       : 'fixed'
    'Background Position'         : '20px 20px'
    'Background Repeat'           : 'repeat'
    'Background Color'            : 'rgba(238,238,238,1)'
    'Thread Wrapper Background'   : 'rgba(255,255,255,1)'
    'Thread Wrapper Border'       : 'rgba(204,204,204,1)'
    'Dialog Background'           : 'rgba(238,221,255,1)'
    'Dialog Border'               : 'rgba(238,221,255,1)'
    'Reply Background'            : 'rgba(238,221,255,1)'
    'Reply Border'                : 'rgba(209,162,255,1)'
    'Highlighted Reply Background': 'rgba(238,221,255,1)'
    'Highlighted Reply Border'    : 'rgba(209,162,255,1)'
    'Backlinked Reply Outline'    : 'rgba(204,101,99,1)'
    'Input Background'            : 'rgba(255,255,255,1)'
    'Input Border'                : 'rgba(204,204,204,1)'
    'Checkbox Background'         : 'rgba(255,255,238,1)'
    'Checkbox Border'             : 'rgba(204,204,204,1)'
    'Buttons Background'          : 'rgba(255,255,255,1)'
    'Buttons Border'              : 'rgba(204,204,204,1)'
    'Focused Input Background'    : 'rgba(255,255,255,1)'
    'Focused Input Border'        : 'rgba(209,162,255,1)'
    'Hovered Input Background'    : 'rgba(238,221,255,1)'
    'Hovered Input Border'        : 'rgba(204,204,204,1)'
    'Navigation Background'       : 'rgba(255,255,255,0.8)'
    'Navigation Border'           : 'rgba(255,255,255,0.8)'
    'Quotelinks'                  : 'rgb(146,92,141)'
    'Backlinks'                   : 'rgb(146,92,141)'
    'Links'                       : 'rgb(133,76,158)'
    'Hovered Links'               : 'rgb(198,23,230)'
    'Navigation Links'            : 'rgb(17,17,17)'
    'Hovered Navigation Links'    : 'rgb(198,23,230)'
    'Names'                       : 'rgb(133,76,158)'
    'Tripcodes'                   : 'rgb(146,92,141)'
    'Emails'                      : 'rgb(133,76,158)'
    'Subjects'                    : 'rgb(17,17,17)'
    'Text'                        : 'rgb(0,0,0)'
    'Inputs'                      : 'rgb(0,0,0)'
    'Post Numbers'                : 'rgb(146,92,141)'
    'Greentext'                   : 'rgb(129,153,65)'
    'Sage'                        : 'rgb(146,92,141)'
    'Board Title'                 : 'rgb(133,76,158)'
    'Timestamps'                  : 'rgb(0,0,0)'
    'Warnings'                    : 'rgb(133,76,158)'
    'Shadow Color'                : 'rgba(0,0,0,.05)'
    'Custom CSS'                  : """
.board {
  box-shadow: 0px 10px 10px 2px rgba(128,128,128,0.5);
  border-radius: 3px;
}
.thread {
  padding:10px;
}
#appchanx-settings.reply.dialog,
#appchanx-settings .dialog {
  background-color:#FFF;
  color:#000;
  border:2px solid #CCC;
}
#appchanx-settings ul {
  border-bottom:1px solid #DBD8D2;
}
#appchanx-settings ul:last-of-type{
  border:none;
}
#qp div.post{
  background-color:rgba(255,255,255,0.9);
  border:1px solid #D1A2FF;
  color:#000;
}"""

  'Blackberry Jam':
    'Author'                      : 'seaweed'
    'Author Tripcode'             : '!POMF.9waa'
    'Dialog Background'           : 'rgba(27,27,27,1)'
    'Dialog Border'               : 'rgba(27,27,27,1)'
    'Background Color'            : 'rgba(45,45,45,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Reply Background'            : 'rgba(27,27,27,1)'
    'Reply Border'                : 'rgba(38,38,38,1)'
    'Highlighted Reply Background': 'rgba(17,17,17,1)'
    'Highlighted Reply Border'    : 'rgba(17,17,17,1)'
    'Backlinked Reply Outline'    : 'rgba(103,204,232,1)'
    'Checkbox Background'         : 'rgba(51,51,51,1)'
    'Checkbox Border'             : 'rgba(51,51,51,1)'
    'Input Background'            : 'rgba(27,27,27,1)'
    'Input Border'                : 'rgba(27,27,27,1)'
    'Focused Input Background'    : 'rgba(27,27,27,1)'
    'Focused Input Border'        : 'rgba(27,27,27,1)'
    'Hovered Input Background'    : 'rgba(17,17,17,1)'
    'Hovered Input Border'        : 'rgba(17,17,17,1)'
    'Buttons Background'          : 'rgba(27,27,27,1)'
    'Buttons Border'              : 'rgba(27,27,27,1)'
    'Navigation Background'       : 'rgba(45,45,45,0.9)'
    'Navigation Border'           : 'rgba(45,45,45,0.9)'
    'Links'                       : 'rgb(218,105,224)'
    'Hovered Links'               : 'rgb(255,0,255)'
    'Navigation Links'            : 'rgb(241,241,241)'
    'Hovered Navigation Links'    : 'rgb(255,0,255)'
    'Subjects'                    : 'rgb(241,241,241)'
    'Names'                       : 'rgb(103,204,232)'
    'Sage'                        : 'rgb(103,204,232)'
    'Tripcodes'                   : 'rgb(103,204,232)'
    'Emails'                      : 'rgb(218,105,224)'
    'Post Numbers'                : 'rgb(218,105,224)'
    'Text'                        : 'rgb(241,241,241)'
    'Quotelinks'                  : 'rgb(223,153,247)'
    'Backlinks'                   : 'rgb(223,153,247)'
    'Greentext'                   : 'rgb(108,204,102)'
    'Board Title'                 : 'rgb(103,204,232)'
    'Timestamps'                  : 'rgb(218,105,224)'
    'Inputs'                      : 'rgb(218,105,224)'
    'Warnings'                    : 'rgb(103,204,232)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : """
.reply.post {
  box-shadow: inset 0px 1px 2px 1px #111;
}
#qr {
  box-shadow: none;
}
#qr textarea,
#qr input[name="name"],
#qr input[name="email"],
#qr input[name="sub"],
#qr input[title="Verification"] {
  box-shadow: inset 0px 1px 2px 0px #111;
}
#qp .post {
  background-color: rgba(29,29,33,1);
  border: 1px solid rgba(95,137,172,0.4);
}
"""

  'Midnight Caek':
    'Author'                      : 'Zixaphir'
    'Author Tripcode'             : '!M.........'
    'Background Color'            : 'rgba(16,16,16,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Dialog Background'           : 'rgba(28,28,28,1)'
    'Dialog Border'               : 'rgba(28,28,28,1)'
    'Reply Background'            : 'rgba(28,28,28,1)'
    'Reply Border'                : 'rgba(28,28,28,1)'
    'Highlighted Reply Background': 'rgba(24,24,24,1)'
    'Highlighted Reply Border'    : 'rgba(24,24,24,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Input Background'            : 'rgba(28,28,28,1)'
    'Input Border'                : 'rgba(28,28,28,1)'
    'Hovered Input Background'    : 'rgba(24,24,24,1)'
    'Hovered Input Border'        : 'rgba(24,24,24,1)'
    'Focused Input Background'    : 'rgba(16,16,16,1)'
    'Focused Input Border'        : 'rgba(28,28,28,1)'
    'Checkbox Background'         : 'rgba(0,0,0,1)'
    'Checkbox Border'             : 'rgba(60,60,60,1)'
    'Buttons Background'          : 'rgba(24,24,24,1)'
    'Buttons Border'              : 'rgba(24,24,24,1)'
    'Navigation Background'       : 'rgba(16,16,16,0.9)'
    'Navigation Border'           : 'rgba(16,16,16,0.9)'
    'Quotelinks'                  : 'rgb(71,71,91)'
    'Backlinks'                   : 'rgb(66,66,71)'
    'Links'                       : 'rgb(87,87,123)'
    'Hovered Links'               : 'rgb(71,71,91)'
    'Navigation Links'            : 'rgb(144,144,144)'
    'Hovered Navigation Links'    : 'rgb(71,71,91)'
    'Names'                       : 'rgb(124,45,45)'
    'Tripcodes'                   : 'rgb(62,113,87)'
    'Emails'                      : 'rgb(68,68,68)'
    'Subjects'                    : 'rgb(170,170,170)'
    'Text'                        : 'rgb(144,144,144)'
    'Inputs'                      : 'rgb(144,144,144)'
    'Post Numbers'                : 'rgb(144,144,144)'
    'Greentext'                   : 'rgb(113,121,62)'
    'Sage'                        : 'rgb(68,68,68)'
    'Board Title'                 : 'rgb(144,144,144)'
    'Timestamps'                  : 'rgb(144,144,144)'
    'Warnings'                    : 'rgb(87,87,123)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : ''

  'Minimalistic Mayhem':
    'Author'                      : 'Mayhem'
    'Author Tripcode'             : '!MayhemYDG.'
    'Background Image'            : 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAACdJREFUCNdNxzEBADAMwzCnOMwfWYDs2JNPCgCoH9m0zQa4jXob4AGJFwxchPNwQAAAAABJRU5ErkJggg==")'
    'Background Color'            : 'rgba(25,25,25,1)'
    'Dialog Background'           : 'rgba(34,34,34,1)'
    'Dialog Border'               : 'rgba(41,41,41,1)'
    'Thread Wrapper Background'   : 'rgba(34,34,34,1)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,1)'
    'Reply Background'            : 'rgba(51,51,51,1)'
    'Reply Border'                : 'rgba(17,17,17,1)'
    'Highlighted Reply Background': 'rgba(37,38,42,1)'
    'Highlighted Reply Border'    : 'rgba(85,85,85,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(57,57,57,1)'
    'Checkbox Border'             : 'rgba(25,25,25,1)'
    'Input Background'            : 'rgba(34,34,34,1)'
    'Input Border'                : 'rgba(21,21,21,1)'
    'Focused Input Background'    : 'rgba(32,32,32,1)'
    'Focused Input Border'        : 'rgba(102,102,102,1)'
    'Hovered Input Background'    : 'rgba(24,24,24,1)'
    'Hovered Input Border'        : 'rgba(21,21,21,1)'
    'Buttons Background'          : 'rgba(32,32,32,1)'
    'Buttons Border'              : 'rgba(16,16,16,1)'
    'Navigation Background'       : 'rgba(26,26,26,0.9)'
    'Navigation Border'           : 'rgba(26,26,26,0.9)'
    'Links'                       : 'rgb(85,156,122)'
    'Hovered Links'               : 'rgb(199,222,26)'
    'Navigation Links'            : 'rgb(144,144,144)'
    'Hovered Navigation Links'    : 'rgb(198,23,230)'
    'Subjects'                    : 'rgb(72,98,115)'
    'Names'                       : 'rgb(46,136,166)'
    'Sage'                        : 'rgb(124,45,45)'
    'Tripcodes'                   : 'rgb(140,93,42)'
    'Emails'                      : 'rgb(174,43,41)'
    'Post Numbers'                : 'rgb(137,115,153)'
    'Text'                        : 'rgb(221,221,221)'
    'Quotelinks'                  : 'rgb(139,164,70)'
    'Backlinks'                   : 'rgb(139,164,70)'
    'Greentext'                   : 'rgb(139,164,70)'
    'Board Title'                 : 'rgb(187,187,187)'
    'Timestamps'                  : 'rgb(221,221,221)'
    'Inputs'                      : 'rgb(187,187,187)'
    'Warnings'                    : 'rgb(87,87,123)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : """
.nameBlock > .useremail > postertrip {
  color: rgb(137,115,153);
}
a.backlink:hover {
  color: rgb(198,23,230);
}
.reply:target,
.reply.highlight:target {
  background:rgb(37,38,42);
}
[alt="sticky"] + a {
  color: rgb(242,141,0);
}
[alt="closed"] + a {
  color: rgb(178,171,130);
}
input:checked .rice {
  border-color:rgb(21,21,21);
}
input[type="submit"],
input[type="button"],
button {
  background: linear-gradient(#393939, #292929);
  border: 1px solid #191919;
  color: #AAA;
  text-shadow: 0 1px 1px #191919;
}
input[type="checkbox"],
input[type="radio"] {
background-color: #393939;
  border: 1px solid #191919;
}
input[type="checkbox"]:checked,
input[type="radio"]:checked {
  background: linear-gradient(#595959, #393939);
  border: 1px solid #151515;
}
.thread {
  padding: 7px;
}
.subject:hover,
div.post:hover .subject {
  color: #3F8DBF !important;
}
.postertrip:hover,
div.post:hover .postertrip {
  color:#CC7212 !important;
}
.name:hover,
div.post:hover .name {
  color: #0AAEE7 !important;
}
.name,
.subject,
.postertrip {
  -webkit-transition:color .3s ease-in-out;
  -moz-transition:color .3s ease-in-out;
  -o-transition:color .3s ease-in-out;
}"""

  'ObsidianChan':
    'Author'                      : 'seaweed'
    'Author Tripcode'             : '!POMF.9waa'
    'Background Image'            : 'url("http://i.imgur.com/sbi8u.png")'
    'Background Attachment'       : 'fixed'
    'Dialog Background'           : 'rgba(0,0,0,0.7)'
    'Dialog Border'               : 'rgba(0,0,0,0.7)'
    'Background Color'            : 'rgba(0,0,0,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0.3)'
    'Thread Wrapper Border'       : 'rgba(51,51,51,1)'
    'Reply Background'            : 'rgba(0,0,0,0.6)'
    'Reply Border'                : 'rgba(0,0,0,0.6)'
    'Highlighted Reply Background': 'rgba(0,0,0,0.4)'
    'Highlighted Reply Border'    : 'rgba(0,0,0,0.4)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(68,68,68,1)'
    'Checkbox Border'             : 'rgba(68,68,68,1)'
    'Input Background'            : 'rgba(0,0,0,0.6)'
    'Input Border'                : 'rgba(0,0,0,0.6)'
    'Hovered Input Background'    : 'rgba(0,0,0,0.4)'
    'Hovered Input Border'        : 'rgba(0,0,0,0.4)'
    'Focused Input Background'    : 'rgba(0,0,0,0.4)'
    'Focused Input Border'        : 'rgba(0,0,0,0.4)'
    'Buttons Background'          : 'rgba(0,0,0,0.4)'
    'Buttons Border'              : 'rgba(0,0,0,0.4)'
    'Navigation Background'       : 'rgba(0,0,0,0.7)'
    'Navigation Border'           : 'rgba(0,0,0,0.7)'
    'Links'                       : 'rgb(0,255,255)'
    'Hovered Links'               : 'rgb(0,255,255)'
    'Navigation Links'            : 'rgb(253,254,255)'
    'Hovered Navigation Links'    : 'rgb(253,254,255)'
    'Subjects'                    : 'rgb(144,144,144)'
    'Names'                       : 'rgb(253,254,255)'
    'Sage'                        : 'rgb(253,254,255)'
    'Tripcodes'                   : 'rgb(255,82,203)'
    'Emails'                      : 'rgb(0,255,255)'
    'Post Numbers'                : 'rgb(0,255,255)'
    'Text'                        : 'rgb(253,254,255)'
    'Quotelinks'                  : 'rgb(0,255,255)'
    'Backlinks'                   : 'rgb(0,255,255)'
    'Greentext'                   : 'rgb(67,204,103)'
    'Board Title'                 : 'rgb(253,254,255)'
    'Timestamps'                  : 'rgb(253,254,255)'
    'Inputs'                      : 'rgb(253,254,255)'
    'Warnings'                    : 'rgb(0,255,255)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : """
#qp div.post{
  background-color:rgba(0,0,0,0.8);
  border: 1px solid #333;
}
#qr {
  background-color: rgba(0,0,0,0.7);
  border: 1px solid #333;
}
"""

  'PaisleyChan':
    'Author'                      : 'Ubuntufriend'
    'Author Tripcode'             : '!TRip.C0d3'
    'Background Image'            : 'url(http://i.imgur.com/DRaZf.jpg)'
    'Background Attachment'       : 'fixed'
    'Background Repeat'           : 'repeat'
    'Background Color'            : 'rgba(19,19,19,1)'
    'Dialog Background'           : 'rgba(16,16,16,1)'
    'Dialog Border'               : 'rgba(16,16,16,1)'
    'Thread Wrapper Background'   : 'rgba(52,56,56,0.3)'
    'Thread Wrapper Border'       : 'rgba(52,56,56,0.3)'
    'Reply Background'            : 'rgba(52,56,56,1)'
    'Reply Border'                : 'rgba(0,0,0,0)'
    'Highlighted Reply Background': 'rgba(0,0,0,0)'
    'Highlighted Reply Border'    : 'rgba(0,0,0,0)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(34,34,34,1)'
    'Checkbox Border'             : 'rgba(60,60,60,1)'
    'Input Background'            : 'rgba(28,28,28,1)'
    'Input Border'                : 'rgba(28,28,28,1)'
    'Hovered Input Background'    : 'rgba(24,24,24,1)'
    'Hovered Input Border'        : 'rgba(24,24,24,1)'
    'Focused Input Background'    : 'rgba(32,32,32,1)'
    'Focused Input Border'        : 'rgba(32,32,32,1)'
    'Buttons Background'          : 'rgba(32,32,32,1)'
    'Buttons Border'              : 'rgba(32,32,32,1)'
    'Navigation Background'       : 'rgba(16,16,16,0.9)'
    'Navigation Border'           : 'rgba(16,16,16,0.9)'
    'Links'                       : 'rgb(187,187,187)'
    'Hovered Links'               : 'rgb(0,223,252)'
    'Navigation Links'            : 'rgb(153,153,153)'
    'Hovered Navigation Links'    : 'rgb(0,223,252)'
    'Subjects'                    : 'rgb(170,170,170)'
    'Names'                       : 'rgb(128,172,206)'
    'Sage'                        : 'rgb(153,153,153)'
    'Tripcodes'                   : 'rgb(128,172,206)'
    'Emails'                      : 'rgb(187,187,187)'
    'Post Numbers'                : 'rgb(153,153,153)'
    'Text'                        : 'rgb(153,153,153)'
    'Quotelinks'                  : 'rgb(212,212,212)'
    'Backlinks'                   : 'rgb(212,212,212)'
    'Greentext'                   : 'rgb(152,185,98)'
    'Board Title'                 : 'rgb(153,153,153)'
    'Timestamps'                  : 'rgb(153,153,153)'
    'Inputs'                      : 'rgb(153,153,153)'
    'Warnings'                    : 'rgb(187,187,187)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : """
#appchanx-settings {
  background-color: rgba(16,16,16,1) !important;
}
#delform blockquote {
  border-radius:3px;
  color:#bbb;
  background:#343838;
  padding:8px;
  box-shadow:0px 0px 20px rgba(25,25,25,0.6);
  border:1px solid #343838;
  border-bottom:2px solid #444848;
  border-radius:0px 6px 6px 6px;
  padding-top:15px;
}
.name {
  font-weight:800;
}
.nameBlock > .useremail > .name:hover,
.nameBlock> .useremail> .postertrip:hover {
  color:#00dffc;
}
a.forwardlink {
  color:#608cae;
  font-weight:800;
}
div.reply,
.reply.highlight {
  padding:0;
}
#qp div.post {
  border:1px solid rgba(128,172,206,0.5) !important;
  background-color: rgba(24,24,24,0.9) !important;
}
.name,
.postertrip {
  text-shadow:0px 0px 6px rgba(20,20,20,0.9);
  font-weight:bold;
  background:#343838;
  border:1px solid #343838;
  border-radius:5px 5px 0px 0px;
  padding:4px 6px;
  padding-top:2px;
}
.board,
.board blockquote {
  margin:0 10px 15px 0 !important;
  padding:0px;
}
a {
  -moz-transition:all 0.5s ease;
  -webkit-transition:all 0.5s ease;
  -o-transition:all 0.5s ease;
}
a.pointer{
  font-weight:bold;
  font-weight:normal;
  color:#777;
  padding-right:5px;
}
.thread .opContainer,
.thread .replyContainer {
  opacity:0.45;
  transition:all 0.5s ease;
}
.thread .opContainer:hover,
.thread .replyContainer:hover {
  opacity:1;
}
.reply.post,
.reply.highlight {
  background:transparent;
  border:0px;
  padding:0px;
  padding-bottom:0px;
  border-radius:6px;
}
#delform blockquote {
  padding:5px;
  background:#343838;
  margin-top:0px;
  min-height:20px;
  padding-top:10px;
  clear:none;
}
  #delform .file + blockquote{
  margin-top:-16px !important;
  padding-left:150px !important;
}
.file {
  margin-top: 2px;
}
a.backlink{
border:1px solid #343838;
border-radius:5px 5px 0px 0px;
background:#343838;
padding:2px 4px 2px;
  text-decoration:none;
}
a.forwardlink{
  color:#608CAE;
  text-shadow:0 0 6px rgba(96,140,174,0.8);
}
.subject{
  font-weight: bold;
  letter-spacing: 3px;
  background: transparent;
}
.reply.post {
  background-color: rgba(0,0,0,0) !important;
  border: none !important;
}
#qp div.post .name,
#qp div.post a.backlink,
#qp div.post blockquote {
  background:none !important;
  border:none !important;
  box-shadow:none !important;
  border-radius:0px !important;
}
"""

  'Photon':
    'Author'                      : 'seaweed'
    'Author Tripcode'             : '!POMF.9waa'
    'Background Color'            : 'rgba(238,238,238,1)'
    'Dialog Background'           : 'rgba(238,238,238,1)'
    'Dialog Border'               : 'rgba(204,204,204,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Reply Background'            : 'rgba(221,221,221,1)'
    'Reply Border'                : 'rgba(204,204,204,1)'
    'Highlighted Reply Background': 'rgba(204,204,204,1)'
    'Highlighted Reply Border'    : 'rgba(204,204,204,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(255,255,238)'
    'Checkbox Border'             : 'rgba(255,255,238)'
    'Input Background'            : 'rgba(255,255,255,1)'
    'Input Border'                : 'rgba(204,204,204,1)'
    'Hovered Input Background'    : 'rgba(204,204,204,1)'
    'Hovered Input Border'        : 'rgba(204,204,204,1)'
    'Focused Input Background'    : 'rgba(255,255,255,1)'
    'Focused Input Border'        : 'rgba(0,74,153,1)'
    'Buttons Background'          : 'rgba(255,255,238,1)'
    'Buttons Border'              : 'rgba(204,204,204,1)'
    'Navigation Background'       : 'rgba(238,238,238,0.9)'
    'Navigation Border'           : 'rgba(238,238,238,0.9)'
    'Links'                       : 'rgb(255,102,0)'
    'Hovered Links'               : 'rgb(255,51,0)'
    'Navigation Links'            : 'rgb(17,17,17)'
    'Hovered Navigation Links'    : 'rgb(255,51,0)'
    'Subjects'                    : 'rgb(17,17,17)'
    'Names'                       : 'rgb(0,74,153)'
    'Sage'                        : 'rgb(51,51,51)'
    'Tripcodes'                   : 'rgb(255,51,0)'
    'Emails'                      : 'rgb(255,102,0)'
    'Post Numbers'                : 'rgb(51,51,51)'
    'Text'                        : 'rgb(51,51,51)'
    'Quotelinks'                  : 'rgb(17,17,17)'
    'Backlinks'                   : 'rgb(17,17,17)'
    'Greentext'                   : 'rgb(120,153,34)'
    'Board Title'                 : 'rgb(0,74,153)'
    'Timestamps'                  : 'rgb(51,51,51)'
    'Inputs'                      : 'rgb(0,0,0)'
    'Warnings'                    : 'rgb(51,51,51)'
    'Shadow Color'                : 'rgba(0,0,0,.05)'
    'Custom CSS'                  : """
.fileText{
  color: rgb(102,102,102);
}
.boardTitle {
  color: #004a99 !important;
  text-shadow: 1px 1px 1px #222 !important;
}
.boardSubtitle,
.boardBanner .boardSubtitle > a  {
  text-shadow: none !important;
}
"""

  'RedUX':
    'Author'                      : 'Zixaphir'
    'Author Tripcode'             : '!VGsTHECURE'
    'Background Image'            : 'linear-gradient(rgba(210,210,210,0.7), rgba(240,240,240,0.4) 400px, rgba(240,240,240,0.3)), url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACEAQMAAABrihHkAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMASuCaZbYAAAA+SURBVHhe7c2xCQAgDAXRKywsHcFRdDNxchtBkhHk4Lp88ui7hhaztBCkyYZ7fFHzI/Jk/GRpaWlpaWlpaR3scHNQSY3kigAAAABJRU5ErkJggg==")'
    'Background Attachment'       : 'fixed, scroll'
    'Background Position'         : 'top, center'
    'Background Repeat'           : 'no-repeat, repeat'
    'Background Color'            : 'rgba(238,242,255,1)'
    'Thread Wrapper Background'   : 'rgb(230,230,230)'
    'Thread Wrapper Border'       : 'rgba(204,204,204,1)'
    'Dialog Background'           : 'linear-gradient(rgb(222,222,222), rgb(240,240,240) 200px, rgb(240,240,240))'
    'Dialog Border'               : 'rgb(220,210,210)'
    'Reply Background'            : 'rgba(230,230,230,1)'
    'Reply Border'                : 'rgba(204,204,204,1)'
    'Highlighted Reply Background': 'rgba(219,219,219,1)'
    'Highlighted Reply Border'    : 'rgba(219,219,219,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Input Background'            : 'linear-gradient(rgb(222,222,222), rgb(240,240,240)), rgb(240,240,240)'
    'Input Border'                : 'rgb(220,210,210)'
    'Hovered Input Background'    : 'linear-gradient(rgba(214,186,208,0.7), rgb(240,240,240)), rgb(240,240,240)'
    'Hovered Input Border'        : 'rgba(214,186,208,1)'
    'Focused Input Background'    : 'rgb(240,240,240)'
    'Focused Input Border'        : 'rgb(220,210,210)'
    'Checkbox Background'         : 'rgba(238,242,255,1)'
    'Checkbox Border'             : 'rgba(180,180,180,1)'
    'Buttons Background'          : 'linear-gradient(rgb(222,222,222), rgb(240,240,240)), rgb(240,240,240)'
    'Buttons Border'              : 'rgb(220,210,210)'
    'Navigation Background'       : 'rgba(230,230,230,0.8)'
    'Navigation Border'           : 'rgba(204,204,204,1)'
    'Quotelinks'                  : 'rgb(153,51,51)'
    'Backlinks'                   : 'rgb(153,51,51)'
    'Links'                       : 'rgb(87,87,123)'
    'Hovered Links'               : 'rgb(221,0,0)'
    'Navigation Links'            : 'rgb(0,0,0)'
    'Hovered Navigation Links'    : 'rgb(87,87,123)'
    'Names'                       : 'rgb(119,51,51)'
    'Tripcodes'                   : 'rgb(119,51,51)'
    'Emails'                      : 'rgb(87,87,123)'
    'Subjects'                    : 'rgb(15,12,93)'
    'Text'                        : 'rgb(0,0,0)'
    'Inputs'                      : 'rgb(0,0,0)'
    'Post Numbers'                : 'rgb(0,0,0)'
    'Greentext'                   : 'rgb(34,133,34)'
    'Sage'                        : 'rgb(87,87,123)'
    'Board Title'                 : 'rgb(119,51,51)'
    'Timestamps'                  : 'rgb(0,0,0)'
    'Warnings'                    : 'rgb(87,87,123)'
    'Shadow Color'                : 'rgba(0,0,0,.07)'
    'Custom CSS'                  : """
.thread .reply {
  background-color: transparent;
  border-color: #ccc transparent transparent transparent;
  border-style: solid;
  border-radius: 0 !important;
  margin-bottom: 0;
}
#themes {
  text-shadow: none;
}
#qp {
  text-shadow: 1px 0 0 rgb(0,0,0),
    1px 1px 0 rgb(0,0,0),
    0 1px 0 rgb(0,0,0),
    1px 1px 2px rgb(0,0,0);
}
#qp .op.post,
#qp .reply.post {
  border: 1px rgba(0,0,0,0.7) solid;
  background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), transparent;
}
#qp div.post,
#qp .pln,
#qp .postNum a {
  color: #fcd;
}
#qp .dateTime {
  color: #fcd !important;
}
#qp .subject,
#qp .nameBlock > .useremail > .name,
#qp .nameBlock > .useremail > .postertrip,
#qp .name,
#qp .postertrip,
#qp .trip {
  color: #ffaac0 !important;
}
#qp a {
  color: #aaaac8;
}
.boardBanner a,
#qp a.backlink,
#qp span.quote > a.quotelink {
  color: rgb(255,255,255);
}
#qp span.quote {
  color: rgb(130,163,100);
}
.board {
  box-shadow: 0 20px 40px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
}
:not(#themes) .rice {
  box-shadow:rgba(170, 170, 170,0.3) 0 1px;
}
#qp .prettyprint {
  background-color: rgba(0,0,0,0.3);
  border: 1px solid rgba(0,0,0,0.5);
}
#qp span.tag {
  color: #96562c;
}
#qp span.pun {
  color: #5b6f2a;
}
#qp span.com {
  color: #a34443;
}
#qp span.str,
#qp span.atv {
  color: #8ba446;
}
#qp span.kwd {
  color: #987d3e;
}
#qp span.typ,
#qp span.atn {
  color: #897399;
}
#qp span.lit {
  color: #558773;
}
"""

  'Solarized':
    'Author'                      : 'ubuntufriend'
    'Author Tripcode'             : '!TRip.C0d'
    'Background Color'            : 'rgba(7,54,66,1)'
    'Dialog Background'           : 'rgba(0,43,54,1)'
    'Dialog Border'               : 'rgba(0,43,54,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Reply Background'            : 'rgba(0,43,54,1)'
    'Reply Border'                : 'rgba(0,43,54,1)'
    'Highlighted Reply Background': 'rgba(7,54,66,1)'
    'Highlighted Reply Border'    : 'rgba(7,54,66,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(88,110,117,1)'
    'Checkbox Border'             : 'rgba(88,110,117,1)'
    'Input Background'            : 'rgba(0,43,54,1)'
    'Input Border'                : 'rgba(0,43,54,1)'
    'Hovered Input Background'    : 'rgba(7,54,66,1)'
    'Hovered Input Border'        : 'rgba(7,54,66,1)'
    'Focused Input Background'    : 'rgba(7,54,66,1)'
    'Focused Input Border'        : 'rgba(7,54,66,1)'
    'Buttons Background'          : 'rgba(0,43,54,1)'
    'Buttons Border'              : 'rgba(0,43,54,1)'
    'Navigation Background'       : 'rgba(7,54,66,1)'
    'Navigation Border'           : 'rgba(7,54,66,1)'
    'Links'                       : 'rgb(108,113,196)'
    'Hovered Links'               : 'rgb(211,54,130)'
    'Navigation Links'            : 'rgb(147,161,161)'
    'Hovered Navigation Links'    : 'rgb(211,54,130)'
    'Subjects'                    : 'rgb(203,75,22)'
    'Names'                       : 'rgb(88,110,117)'
    'Sage'                        : 'rgb(108,113,196)'
    'Tripcodes'                   : 'rgb(42,161,152)'
    'Emails'                      : 'rgb(108,113,196)'
    'Post Numbers'                : 'rgb(147,161,161)'
    'Text'                        : 'rgb(147,161,161)'
    'Quotelinks'                  : 'rgb(79,95,143)'
    'Backlinks'                   : 'rgb(79,95,143)'
    'Greentext'                   : 'rgb(133,153,0)'
    'Board Title'                 : 'rgb(147,161,161)'
    'Timestamps'                  : 'rgb(147,161,161)'
    'Inputs'                      : 'rgb(147,161,161)'
    'Warnings'                    : 'rgb(108,113,196)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : """
#qp div.post {
  background-color:rgba(7,54,66,0.9);
  border:1px solid rgba(79,95,143,0.9);
}
"""

  'Yotsuba':
    'Author'                      : 'moot'
    'Author Tripcode'             : '!Ep8pui8Vw2'
    'Background Image'            : 'linear-gradient(rgb(254,214,175), rgb(255,255,238) 200px, rgb(255,255,238))'
    'Background Color'            : 'rgba(255,255,238,1)'
    'Dialog Background'           : 'rgba(240,224,214,1)'
    'Dialog Border'               : 'rgba(217,191,183,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Reply Background'            : 'rgba(240,224,214,1)'
    'Reply Border'                : 'rgba(217,191,183,1)'
    'Highlighted Reply Background': 'rgba(240,192,176,1)'
    'Highlighted Reply Border'    : 'rgba(217,191,183,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(255,255,238,1)'
    'Checkbox Border'             : 'rgba(217,191,183,1)'
    'Input Background'            : 'rgba(240,224,214,1)'
    'Input Border'                : 'rgba(217,191,183,1)'
    'Hovered Input Background'    : 'rgba(240,224,214,1)'
    'Hovered Input Border'        : 'rgba(217,191,183,1)'
    'Focused Input Background'    : 'rgba(255,255,255,1)'
    'Focused Input Border'        : 'rgba(128,0,0,1)'
    'Buttons Background'          : 'rgba(240,192,176,1)'
    'Buttons Border'              : 'rgba(217,191,183,1)'
    'Navigation Background'       : 'rgba(240,192,176,0.7)'
    'Navigation Border'           : 'rgba(217,191,183,1)'
    'Links'                       : 'rgb(186,0,0)'
    'Hovered Links'               : 'rgb(221,0,0)'
    'Navigation Links'            : 'rgb(128,0,0)'
    'Hovered Navigation Links'    : 'rgb(221,0,0)'
    'Subjects'                    : 'rgb(204,17,5)'
    'Names'                       : 'rgb(17,119,67)'
    'Sage'                        : 'rgb(204,17,17)'
    'Tripcodes'                   : 'rgb(34,136,84)'
    'Emails'                      : 'rgb(186,0,0)'
    'Post Numbers'                : 'rgb(128,0,0)'
    'Text'                        : 'rgb(128,0,0)'
    'Quotelinks'                  : 'rgb(221,0,0)'
    'Backlinks'                   : 'rgb(220,0,0)'
    'Greentext'                   : 'rgb(120,153,34)'
    'Board Title'                 : 'rgb(204,17,5)'
    'Timestamps'                  : 'rgb(186,0,0)'
    'Inputs'                      : 'rgb(0,0,0)'
    'Warnings'                    : 'rgb(128,0,0)'
    'Shadow Color'                : 'rgba(0,0,0,.05)'
    'Custom CSS'                  : """
#qp div.post {
  background-color:rgba(240,192,176,1);
  box-shadow:5px 5px 5px rgba(128,128,128,0.5);
}
.reply.post {
  border-color: transparent rgba(240,224,214,1) rgba(240,224,214,1) transparent;
}
"""

  'Yotsuba B':
    'Author'                      : 'moot'
    'Author Tripcode'             : '!Ep8pui8Vw2'
    'Background Image'            : 'linear-gradient(rgb(209,213,238), rgb(238,242,255) 200px, rgb(238,242,255))'
    'Background Color'            : 'rgba(238,242,255,1)'
    'Dialog Background'           : 'rgba(214,218,240,1)'
    'Dialog Border'               : 'rgba(183,197,217,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Reply Background'            : 'rgba(214,218,240,1)'
    'Reply Border'                : 'rgba(183,197,217,1)'
    'Highlighted Reply Background': 'rgba(214,186,208,1)'
    'Highlighted Reply Border'    : 'rgba(183,197,217,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(238,242,255,1)'
    'Checkbox Border'             : 'rgba(183,197,217,1)'
    'Input Background'            : 'rgba(238,242,255,1)'
    'Input Border'                : 'rgba(183,197,217,1)'
    'Hovered Input Background'    : 'rgba(214,186,208,1)'
    'Hovered Input Border'        : 'rgba(183,197,217,1)'
    'Focused Input Background'    : 'rgba(214,218,240,1)'
    'Focused Input Border'        : 'rgba(153,136,238,1)'
    'Buttons Background'          : 'rgba(214,218,240,1)'
    'Buttons Border'              : 'rgba(183,197,217,1)'
    'Navigation Background'       : 'rgba(211,215,238,0.7)'
    'Navigation Border'           : 'rgba(183,197,217,1)'
    'Links'                       : 'rgb(52,52,92)'
    'Hovered Links'               : 'rgb(221,0,0)'
    'Navigation Links'            : 'rgb(0,0,0)'
    'Hovered Navigation Links'    : 'rgb(221,0,0)'
    'Subjects'                    : 'rgb(15,12,93)'
    'Names'                       : 'rgb(17,119,67)'
    'Sage'                        : 'rgb(153,0,0)'
    'Tripcodes'                   : 'rgb(34,136,84)'
    'Emails'                      : 'rgb(87,87,123)'
    'Post Numbers'                : 'rgb(0,0,0)'
    'Text'                        : 'rgb(0,0,0)'
    'Quotelinks'                  : 'rgb(221,0,0)'
    'Backlinks'                   : 'rgb(52,52,92)'
    'Greentext'                   : 'rgb(120,153,34)'
    'Board Title'                 : 'rgb(175,10,15)'
    'Timestamps'                  : 'rgb(0,0,0)'
    'Inputs'                      : 'rgb(0,0,0)'
    'Warnings'                    : 'rgb(87,87,123)'
    'Shadow Color'                : 'rgba(0,0,0,.05)'
    'Custom CSS'                  : """
#qp div.post {
  background-color:rgba(214,186,208,1);
  box-shadow:5px 5px 5px rgba(128,128,128,0.5);
}
.reply.post {
  border-color: transparent rgba(183,197,217,1) rgba(183,197,217,1) transparent;
}
"""

  'Zenburned':
    'Author'                      : 'lazy'
    'Author Tripcode'             : '!HONKYn7h1.'
    'Background Color'            : 'rgba(63,63,63,1)'
    'Dialog Background'           : 'rgba(87,87,87,1)'
    'Dialog Border'               : 'rgba(87,87,87,1)'
    'Thread Wrapper Background'   : 'rgba(0,0,0,0)'
    'Thread Wrapper Border'       : 'rgba(0,0,0,0)'
    'Reply Background'            : 'rgba(87,87,87,1)'
    'Reply Border'                : 'rgba(87,87,87,1)'
    'Highlighted Reply Background': 'rgba(38,38,38,1)'
    'Highlighted Reply Border'    : 'rgba(38,38,38,1)'
    'Backlinked Reply Outline'    : 'rgba(98,124,141,1)'
    'Checkbox Background'         : 'rgba(63,63,63,1)'
    'Checkbox Border'             : 'rgba(136,136,136,1)'
    'Input Background'            : 'rgba(87,87,87,1)'
    'Input Border'                : 'rgba(136,136,136,1)'
    'Hovered Input Background'    : 'rgba(38,38,38,1)'
    'Hovered Input Border'        : 'rgba(38,38,38,1)'
    'Focused Input Background'    : 'rgba(38,38,38,1)'
    'Focused Input Border'        : 'rgba(153,136,238,1)'
    'Buttons Background'          : 'rgba(49,60,54,1)'
    'Buttons Border'              : 'rgba(136,136,136,1)'
    'Navigation Background'       : 'rgba(63,63,63,0.9)'
    'Navigation Border'           : 'rgba(63,63,63,0.9)'
    'Links'                       : 'rgb(239,220,188)'
    'Hovered Links'               : 'rgb(248,248,147)'
    'Navigation Links'            : 'rgb(220,220,204)'
    'Hovered Navigation Links'    : 'rgb(248,248,147)'
    'Subjects'                    : 'rgb(170,170,170)'
    'Names'                       : 'rgb(192,190,209)'
    'Sage'                        : 'rgb(220,220,204)'
    'Tripcodes'                   : 'rgb(140,208,211)'
    'Emails'                      : 'rgb(239,220,188)'
    'Post Numbers'                : 'rgb(220,220,204)'
    'Text'                        : 'rgb(220,220,204)'
    'Quotelinks'                  : 'rgb(220,163,163)'
    'Backlinks'                   : 'rgb(220,163,163)'
    'Greentext'                   : 'rgb(127,159,127)'
    'Board Title'                 : 'rgb(220,220,204)'
    'Timestamps'                  : 'rgb(220,220,204)'
    'Inputs'                      : 'rgb(220,220,204)'
    'Warnings'                    : 'rgb(239,220,188)'
    'Shadow Color'                : 'rgba(0,0,0,.1)'
    'Custom CSS'                  : ''

  "ピンク":
    "Author"                      : "DrooidKun"
    "Author Tripcode"             : "!/Apk/MRkGM"
    "Background Color"            : "rgb(255,255,255)"
    "Dialog Background"           : "rgba(242,242,242,.98)"
    "Dialog Border"               : "rgb(240,240,240)"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Reply Background"            : "rgba(242,242,242,1.0)"
    "Reply Border"                : "rgb(240,240,240)"
    "Highlighted Reply Background": "rgba(238,238,238,1.0)"
    "Highlighted Reply Border"    : "rgb(191,122,180)"
    "Backlinked Reply Outline"    : "rgb(191,122,180)"
    "Checkbox Background"         : "rgba(240,240,240,1.0)"
    "Checkbox Border"             : "rgb(222,222,222)"
    "Input Background"            : "rgba(240,240,240,1.0)"
    "Input Border"                : "rgb(222,222,222)"
    "Hovered Input Background"    : "rgba(224,224,224,1.0)"
    "Hovered Input Border"        : "rgb(222,222,222)"
    "Focused Input Background"    : "rgba(224,224,224,1.0)"
    "Focused Input Border"        : "rgb(222,222,222)"
    "Buttons Background"          : "rgba(240,240,240,1.0)"
    "Buttons Border"              : "rgb(222,222,222)"
    "Navigation Background"       : "rgba(255,255,255,0.8)"
    "Navigation Border"           : "rgb(242,242,242)"
    "Quotelinks"                  : "rgb(191,122,180)"
    "Links"                       : "rgb(191,122,180)"
    "Hovered Links"               : "rgb(198,105,201)"
    "Navigation Links"            : "rgb(77,77,76)"
    "Hovered Navigation Links"    : "rgb(198,105,201)"
    "Subjects"                    : "rgb(77,77,77)"
    "Names"                       : "rgb(204,94,193)"
    "Sage"                        : "rgb(200,40,41)"
    "Tripcodes"                   : "rgb(198,105,201)"
    "Emails"                      : "rgb(191,122,180)"
    "Post Numbers"                : "rgb(191,122,180)"
    "Text"                        : "rgb(77,77,76)"
    "Backlinks"                   : "rgb(191,122,180)"
    "Greentext"                   : "rgb(113,140,0)"
    "Board Title"                 : "rgb(77,77,76)"
    "Timestamps"                  : "rgb(77,77,76)"
    "Inputs"                      : "rgb(77,77,76)"
    "Warnings"                    : "rgb(200,40,41)"
    "Shadow Color"                : "rgba(0,0,0,0.05)"
    "Custom CSS"                  : """
.rice {
  box-shadow:rgba(255,255,255,.3) 0 1px;
}
nput[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
.boardTitle {
  color: #cc5ec1 !important;
  text-shadow: 1px 1px 1px #772E28 !important;
}
.boardSubtitle,
.boardBanner .boardSubtitle > a {
  text-shadow: none !important;
}
"""

  "Yotsuba Purple":
    "Author"                      : "seaweed"
    "Author Tripcode"             : "!POMF.9waa"
    "Background Image"            : "linear-gradient(rgba(238,221,255,1.0), rgba(248,243,254,1) 200px, rgba(248,243,254,1))"
    "Background Color"            : "rgb(248,243,254)"
    "Dialog Background"           : "rgba(238,221,255,.98)"
    "Dialog Border"               : "rgb(202,183,217)"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Reply Background"            : "rgba(238,221,255,1.0)"
    "Reply Border"                : "rgb(202,183,217)"
    "Highlighted Reply Background": "rgba(234,217,251,1.0)"
    "Highlighted Reply Border"    : "rgb(150,37,148)"
    "Backlinked Reply Outline"    : "rgb(150,37,148)"
    "Checkbox Background"         : "rgba(255,255,255,1.0)"
    "Checkbox Border"             : "rgb(202,183,217)"
    "Input Background"            : "rgba(255,255,255,1.0)"
    "Input Border"                : "rgb(202,183,217)"
    "Hovered Input Background"    : "rgba(239,239,239,1.0)"
    "Hovered Input Border"        : "rgb(202,183,217)"
    "Focused Input Background"    : "rgba(239,239,239,1.0)"
    "Focused Input Border"        : "rgb(202,183,217)"
    "Buttons Background"          : "rgba(255,255,255,1.0)"
    "Buttons Border"              : "rgb(202,183,217)"
    "Navigation Background"       : "rgba(229, 219, 240,.9)"
    "Navigation Border"           : "rgb(238,221,255)"
    "Quotelinks"                  : "rgb(150,37,148)"
    "Links"                       : "rgb(150,37,148)"
    "Hovered Links"               : "rgb(178,44,170)"
    "Navigation Links"            : "rgb(0,0,0)"
    "Hovered Navigation Links"    : "rgb(178,44,170)"
    "Subjects"                    : "rgb(15,12,93)"
    "Names"                       : "rgb(89,17,119)"
    "Sage"                        : "rgb(153,0,0)"
    "Tripcodes"                   : "rgb(178,44,170)"
    "Emails"                      : "rgb(150,37,148)"
    "Post Numbers"                : "rgb(150,37,148)"
    "Text"                        : "rgb(0,0,0)"
    "Backlinks"                   : "rgb(150,37,148)"
    "Greentext"                   : "rgb(120,153,34)"
    "Board Title"                 : "rgb(0,0,0)"
    "Timestamps"                  : "rgb(0,0,0)"
    "Inputs"                      : "rgb(0,0,0)"
    "Warnings"                    : "rgb(153,0,0)"
    "Shadow Color"                : "rgba(0,0,0,.05)"
    "Custom CSS"                  : """
.rice {
  box-shadow:rgba(255,253,255,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
.boardTitle {
  color: #591177 !important;
  text-shadow: 1px 1px 1px #222 !important;
}
.boardSubtitle,
.boardBanner .boardSubtitle > a {
  text-shadow: none !important;
}
.postNum a {
  color: #000000 !important;
}
.reply.post {
  border-color: transparent rgb(202,183,217) rgb(202,183,217) transparent;
}
"""

  "Vimyanized Dark":
    "Author"                      : "seaweed"
    "Author Tripcode"             : "!POMF.9waa"
    "Background Color"            : "rgb(9,13,15)"
    "Dialog Background"           : "rgba(13,17,20,.98)"
    "Dialog Border"               : "rgb(11,19,22)"
    "Thread Wrapper Background"   : "rgba(13,17,20,.5)"
    "Thread Wrapper Border"       : "rgba(11,19,22,.9)"
    "Reply Background"            : "rgba(13,17,20,.9)"
    "Reply Border"                : "rgb(11,19,22)"
    "Highlighted Reply Background": "rgba(9,13,16,.9)"
    "Highlighted Reply Border"    : "rgb(83,189,177)"
    "Backlinked Reply Outline"    : "rgb(83,189,177)"
    "Checkbox Background"         : "rgba(9,13,15,.9)"
    "Checkbox Border"             : "rgb(11,19,22)"
    "Input Background"            : "rgba(9,13,15,.9)"
    "Input Border"                : "rgb(11,19,22)"
    "Hovered Input Background"    : "rgba(0,0,0,.9)"
    "Hovered Input Border"        : "rgb(11,19,22)"
    "Focused Input Background"    : "rgba(0,0,0,.9)"
    "Focused Input Border"        : "rgb(11,19,22)"
    "Buttons Background"          : "rgba(9,13,15,.9)"
    "Buttons Border"              : "rgb(11,19,22)"
    "Navigation Background"       : "rgba(9,13,15,0.8)"
    "Navigation Border"           : "rgb(13,17,20)"
    "Quotelinks"                  : "rgb(83,189,177)"
    "Links"                       : "rgb(83,189,177)"
    "Hovered Links"               : "rgb(48,144,181)"
    "Navigation Links"            : "rgb(248,248,248)"
    "Hovered Navigation Links"    : "rgb(48,144,181)"
    "Subjects"                    : "rgb(184,140,209)"
    "Names"                       : "rgb(214,62,52)"
    "Sage"                        : "rgb(79,79,79)"
    "Tripcodes"                   : "rgb(212,182,60)"
    "Emails"                      : "rgb(83,189,177)"
    "Post Numbers"                : "rgb(83,189,177)"
    "Text"                        : "rgb(248,248,248)"
    "Backlinks"                   : "rgb(83,189,177)"
    "Greentext"                   : "rgb(150,200,59)"
    "Board Title"                 : "rgb(248,248,248)"
    "Timestamps"                  : "rgb(221,221,221)"
    "Inputs"                      : "rgb(248,248,248)"
    "Warnings"                    : "rgb(79,79,79)"
    "Shadow Color"                : "rgba(0,0,0,.1)"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(45,49,52,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
"""

  "Tomorrow Night":
    "Author"                      : "Chris Kempson"
    "Author Tripcode"             : "!.pC/AHOKAg"
    "Background Color"            : "rgb(29,31,33)"
    "Dialog Background"           : "rgba(40,42,46,.98)"
    "Dialog Border"               : "rgb(55,59,65)"
    "Thread Wrapper Background"   : "rgba(40,42,46,.5)"
    "Thread Wrapper Border"       : "rgba(55,59,65,.9)"
    "Reply Background"            : "rgba(40,42,46,.9)"
    "Reply Border"                : "rgb(55,59,65)"
    "Highlighted Reply Background": "rgba(36,38,42,.9)"
    "Highlighted Reply Border"    : "rgb(129,162,190)"
    "Backlinked Reply Outline"    : "rgb(129,162,190)"
    "Checkbox Background"         : "rgba(40,42,46,.9)"
    "Checkbox Border"             : "rgb(29,31,33)"
    "Input Background"            : "rgba(40,42,46,.9)"
    "Input Border"                : "rgb(29,31,33)"
    "Hovered Input Background"    : "rgba(24,26,30,.9)"
    "Hovered Input Border"        : "rgb(29,31,33)"
    "Focused Input Background"    : "rgba(24,26,30,.9)"
    "Focused Input Border"        : "rgb(29,31,33)"
    "Buttons Background"          : "rgba(40,42,46,.9)"
    "Buttons Border"              : "rgb(29,31,33)"
    "Navigation Background"       : "rgba(29,31,33,0.8)"
    "Navigation Border"           : "rgb(40,42,46)"
    "Quotelinks"                  : "rgb(129,162,190)"
    "Links"                       : "rgb(129,162,190)"
    "Hovered Links"               : "rgb(204,102,102)"
    "Navigation Links"            : "rgb(197,200,198)"
    "Hovered Navigation Links"    : "rgb(204,102,102)"
    "Subjects"                    : "rgb(178,148,187)"
    "Names"                       : "rgb(129,162,190)"
    "Sage"                        : "rgb(204,102,102)"
    "Tripcodes"                   : "rgb(138,190,183)"
    "Emails"                      : "rgb(129,162,190)"
    "Post Numbers"                : "rgb(129,162,190)"
    "Text"                        : "rgb(197,200,198)"
    "Backlinks"                   : "rgb(129,162,190)"
    "Greentext"                   : "rgb(181,189,104)"
    "Board Title"                 : "rgb(197,200,198)"
    "Timestamps"                  : "rgb(197,200,198)"
    "Inputs"                      : "rgb(197,200,198)"
    "Warnings"                    : "rgb(204,102,102)"
    "Shadow Color"                : "rgba(0,0,0,.1)"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(72,74,78,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
"""

  "Solarized Light":
    "Author"                      : "seaweed"
    "Author Tripcode"             : "!POMF.9waa"
    "Background Color"            : "rgb(240,240,240)"
    "Dialog Background"           : "rgba(253,246,227,.98)"
    "Dialog Border"               : "rgb(230,223,206)"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Reply Background"            : "rgba(253,246,227,1.0)"
    "Reply Border"                : "rgb(230,223,206)"
    "Highlighted Reply Background": "rgba(249,242,223,1.0)"
    "Highlighted Reply Border"    : "rgb(108,113,196)"
    "Backlinked Reply Outline"    : "rgb(108,113,196)"
    "Checkbox Background"         : "rgba(255,255,255,1.0)"
    "Checkbox Border"             : "rgb(204,204,204)"
    "Input Background"            : "rgba(255,255,255,1.0)"
    "Input Border"                : "rgb(204,204,204)"
    "Hovered Input Background"    : "rgba(239,239,239,1.0)"
    "Hovered Input Border"        : "rgb(204,204,204)"
    "Focused Input Background"    : "rgba(239,239,239,1.0)"
    "Focused Input Border"        : "rgb(204,204,204)"
    "Buttons Background"          : "rgba(255,255,255,1.0)"
    "Buttons Border"              : "rgb(204,204,204)"
    "Navigation Background"       : "rgba(240,240,240,0.8)"
    "Navigation Border"           : "rgb(253,246,227)"
    "Quotelinks"                  : "rgb(108,113,196)"
    "Links"                       : "rgb(108,113,196)"
    "Hovered Links"               : "rgb(211,54,130)"
    "Navigation Links"            : "rgb(101,123,131)"
    "Hovered Navigation Links"    : "rgb(211,54,130)"
    "Subjects"                    : "rgb(181,137,0)"
    "Names"                       : "rgb(101,123,131)"
    "Sage"                        : "rgb(153,0,0)"
    "Tripcodes"                   : "rgb(42,161,152)"
    "Emails"                      : "rgb(108,113,196)"
    "Post Numbers"                : "rgb(108,113,196)"
    "Text"                        : "rgb(101,123,131)"
    "Backlinks"                   : "rgb(108,113,196)"
    "Greentext"                   : "rgb(133,153,0)"
    "Board Title"                 : "rgb(101,123,131)"
    "Timestamps"                  : "rgb(101,123,131)"
    "Inputs"                      : "rgb(101,123,131)"
    "Warnings"                    : "rgb(153,0,0)"
    "Shadow Color"                : "rgba(0,0,0,.05)"
    "Custom CSS"                  : """
.rice {
  box-shadow:rgba(255,255,255,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
.boardTitle {
  color: #b58900 !important;
  text-shadow: 1px 1px 1px #999 !important;
}
.boardSubtitle,
.boardBanner .boardSubtitle > a {
  text-shadow: none !important;
}
.postNum a {
  color: #657b83 !important;
}
"""

  "Muted":
    "Author"                      : "seaweed"
    "Author Tripcode"             : "!POMF.9waa"
    "Background Color"            : "rgb(255,255,255)"
    "Dialog Background"           : "rgba(245,242,233,.98)"
    "Dialog Border"               : "rgb(204,204,204)"
    "Thread Wrapper Background"   : "rgba(245,242,233,.5)"
    "Thread Wrapper Border"       : "rgba(204,204,204,.9)"
    "Reply Background"            : "rgba(245,242,233,.9)"
    "Reply Border"                : "rgb(204,204,204)"
    "Highlighted Reply Background": "rgba(241,238,229,.9)"
    "Highlighted Reply Border"    : "rgb(188,49,42)"
    "Backlinked Reply Outline"    : "rgb(188,49,42)"
    "Checkbox Background"         : "rgba(255,255,255,.9)"
    "Checkbox Border"             : "rgb(204,204,204)"
    "Input Background"            : "rgba(255,255,255,.9)"
    "Input Border"                : "rgb(204,204,204)"
    "Hovered Input Background"    : "rgba(239,239,239,.9)"
    "Hovered Input Border"        : "rgb(204,204,204)"
    "Focused Input Background"    : "rgba(239,239,239,.9)"
    "Focused Input Border"        : "rgb(204,204,204)"
    "Buttons Background"          : "rgba(255,255,255,.9)"
    "Buttons Border"              : "rgb(204,204,204)"
    "Navigation Background"       : "rgba(255,255,255,0.8)"
    "Navigation Border"           : "rgb(245,242,233)"
    "Quotelinks"                  : "rgb(188,49,42)"
    "Links"                       : "rgb(188,49,42)"
    "Hovered Links"               : "rgb(142,34,32)"
    "Navigation Links"            : "rgb(57,55,53)"
    "Hovered Navigation Links"    : "rgb(142,34,32)"
    "Subjects"                    : "rgb(17,17,17)"
    "Names"                       : "rgb(44,100,160)"
    "Sage"                        : "rgb(153,0,0)"
    "Tripcodes"                   : "rgb(204,101,99)"
    "Emails"                      : "rgb(188,49,42)"
    "Post Numbers"                : "rgb(188,49,42)"
    "Text"                        : "rgb(57,55,53)"
    "Backlinks"                   : "rgb(188,49,42)"
    "Greentext"                   : "rgb(120,153,34)"
    "Board Title"                 : "rgb(57,55,53)"
    "Timestamps"                  : "rgb(51,51,51)"
    "Inputs"                      : "rgb(57,55,53)"
    "Warnings"                    : "rgb(153,0,0)"
    "Shadow Color"                : "rgba(0,0,0,.05)"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(255,255,255,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
.boardTitle{
color:#bc312a!important;
  text-shadow:1px 1px 1px #772e28 !important;
}
.boardSubtitle,
.boardBanner .boardSubtitle > a {
  text-shadow:none!important;
}
.postNum a {
  color:#111111!important;
}
div.reply a.quotelink{
  color:#bc312a!important;
}
"""

  "Monokai":
    "Author"                      : "seaweed"
    "Author Tripcode"             : "!POMF.9waa"
    "Background Color"            : "rgb(32,33,28)"
    "Dialog Background"           : "rgba(39,40,34,.98)"
    "Dialog Border"               : "rgb(45,46,39)"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Reply Background"            : "rgba(39,40,34,1.0)"
    "Reply Border"                : "rgb(45,46,39)"
    "Highlighted Reply Background": "rgba(35,36,30,1.0)"
    "Highlighted Reply Border"    : "rgb(226,219,116)"
    "Backlinked Reply Outline"    : "rgb(226,219,116)"
    "Checkbox Background"         : "rgba(32,33,28,1.0)"
    "Checkbox Border"             : "rgb(23,23,19)"
    "Input Background"            : "rgba(32,33,28,1.0)"
    "Input Border"                : "rgb(23,23,19)"
    "Hovered Input Background"    : "rgba(16,17,12,1.0)"
    "Hovered Input Border"        : "rgb(23,23,19)"
    "Focused Input Background"    : "rgba(16,17,12,1.0)"
    "Focused Input Border"        : "rgb(23,23,19)"
    "Buttons Background"          : "rgba(32,33,28,1.0)"
    "Buttons Border"              : "rgb(23,23,19)"
    "Navigation Background"       : "rgba(32,33,28,0.8)"
    "Navigation Border"           : "rgb(39,40,34)"
    "Quotelinks"                  : "rgb(226,219,116)"
    "Links"                       : "rgb(226,219,116)"
    "Hovered Links"               : "rgb(174,129,255)"
    "Navigation Links"            : "rgb(248,248,242)"
    "Hovered Navigation Links"    : "rgb(174,129,255)"
    "Subjects"                    : "rgb(174,129,255)"
    "Names"                       : "rgb(90,192,204)"
    "Sage"                        : "rgb(79,79,79)"
    "Tripcodes"                   : "rgb(250,130,32)"
    "Emails"                      : "rgb(226,219,116)"
    "Post Numbers"                : "rgb(226,219,116)"
    "Text"                        : "rgb(248,248,242)"
    "Backlinks"                   : "rgb(226,219,116)"
    "Greentext"                   : "rgb(162,204,40)"
    "Board Title"                 : "rgb(248,248,242)"
    "Timestamps"                  : "rgb(248,248,242)"
    "Inputs"                      : "rgb(248,248,242)"
    "Warnings"                    : "rgb(79,79,79)"
    "Shadow Color"                : "rgba(0,0,0,.12)"
    "Custom CSS"                  : """
.rice {
  box-shadow:rgba(71,72,66,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
"""

  "Dark Flat":
    "Author"                      : "Ahoka"
    "Author Tripcode"             : "!.pC/AHOKAg"
    "Background Image"            : "url(\"data:image/gif;base64,R0lGODlhAwADAIAAAB0dHRkZGSH5BADoAwAALAAAAAADAAMAAAIDDG5YADs=\")"
    "Background Attachment"       : "fixed"
    "Background Position"         : "top left"
    "Background Repeat"           : "repeat"
    "Background Color"            : "rgb(32,32,32)"
    "Dialog Background"           : "rgba(35,36,37,.98)"
    "Dialog Border"               : "rgb(41,42,43)"
    "Thread Wrapper Background"   : "rgba(35,36,37,.5)"
    "Thread Wrapper Border"       : "rgba(41,42,43,.9)"
    "Reply Background"            : "rgba(35,36,37,.9)"
    "Reply Border"                : "rgba(35,36,37,.9)"
    "Highlighted Reply Background": "rgba(31,32,33,.9)"
    "Highlighted Reply Border"    : "rgb(172,155,176)"
    "Backlinked Reply Outline"    : "rgb(172,155,176)"
    "Checkbox Background"         : "rgba(24,25,26,.9)"
    "Checkbox Border"             : "rgb(18,19,20)"
    "Input Background"            : "rgba(24,25,26,.9)"
    "Input Border"                : "rgb(18,19,20)"
    "Hovered Input Background"    : "rgba(8,9,10,.9)"
    "Hovered Input Border"        : "rgb(18,19,20)"
    "Focused Input Background"    : "rgba(8,9,10,.9)"
    "Focused Input Border"        : "rgb(18,19,20)"
    "Buttons Background"          : "rgba(24,25,26,.9)"
    "Buttons Border"              : "rgb(18,19,20)"
    "Navigation Background"       : "rgba(32,32,32,0.8)"
    "Navigation Border"           : "rgb(35,36,37)"
    "Quotelinks"                  : "rgb(172,155,176)"
    "Links"                       : "rgb(172,155,176)"
    "Hovered Links"               : "rgb(111,153,180)"
    "Navigation Links"            : "rgb(221,221,221)"
    "Hovered Navigation Links"    : "rgb(111,153,180)"
    "Subjects"                    : "rgb(147,144,201)"
    "Names"                       : "rgb(168,198,217)"
    "Sage"                        : "rgb(201,144,144)"
    "Tripcodes"                   : "rgb(212,192,149)"
    "Emails"                      : "rgb(172,155,176)"
    "Post Numbers"                : "rgb(172,155,176)"
    "Text"                        : "rgb(221,221,221)"
    "Backlinks"                   : "rgb(172,155,176)"
    "Greentext"                   : "rgb(179,196,94)"
    "Board Title"                 : "rgb(221,221,221)"
    "Timestamps"                  : "rgb(221,221,221)"
    "Inputs"                      : "rgb(221,221,221)"
    "Warnings"                    : "rgb(201,144,144)"
    "Shadow Color"                : "rgba(0,0,0,.1)"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(67,68,69,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
"""

  "Blackboard":
    "Author"                      : "seaweed"
    "Author Tripcode"             : "!POMF.9waa"
    "Background Color"            : "rgb(10,13,28)"
    "Dialog Background"           : "rgba(12,16,33,.98)"
    "Dialog Border"               : "rgb(14,18,40)"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Reply Background"            : "rgba(12,16,33,1.0)"
    "Reply Border"                : "rgb(14,18,40)"
    "Highlighted Reply Background": "rgba(8,12,29,1.0)"
    "Highlighted Reply Border"    : "rgb(251,222,45)"
    "Backlinked Reply Outline"    : "rgb(251,222,45)"
    "Checkbox Background"         : "rgba(12,16,33,1.0)"
    "Checkbox Border"             : "rgb(8,11,22)"
    "Input Background"            : "rgba(12,16,33,1.0)"
    "Input Border"                : "rgb(8,11,22)"
    "Hovered Input Background"    : "rgba(0,0,17,1.0)"
    "Hovered Input Border"        : "rgb(8,11,22)"
    "Focused Input Background"    : "rgba(0,0,17,1.0)"
    "Focused Input Border"        : "rgb(8,11,22)"
    "Buttons Background"          : "rgba(12,16,33,1.0)"
    "Buttons Border"              : "rgb(8,11,22)"
    "Navigation Background"       : "rgba(10,13,28,0.8)"
    "Navigation Border"           : "rgb(12,16,33)"
    "Quotelinks"                  : "rgb(251,222,45)"
    "Links"                       : "rgb(251,222,45)"
    "Hovered Links"               : "rgb(75,101,204)"
    "Navigation Links"            : "rgb(248,248,248)"
    "Hovered Navigation Links"    : "rgb(75,101,204)"
    "Subjects"                    : "rgb(255,100,0)"
    "Names"                       : "rgb(141,166,206)"
    "Sage"                        : "rgb(79,79,79)"
    "Tripcodes"                   : "rgb(255,100,0)"
    "Emails"                      : "rgb(251,222,45)"
    "Post Numbers"                : "rgb(251,222,45)"
    "Text"                        : "rgb(248,248,248)"
    "Backlinks"                   : "rgb(251,222,45)"
    "Greentext"                   : "rgb(154,207,8)"
    "Board Title"                 : "rgb(248,248,248)"
    "Timestamps"                  : "rgb(221,221,221)"
    "Inputs"                      : "rgb(248,248,248)"
    "Warnings"                    : "rgb(79,79,79)"
    "Shadow Color"                : "rgba(0,0,0,.1)"
    "Custom CSS"                  : """
.rice {
  box-shadow:rgba(44,48,65,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
.postInfo {
  box-shadow: 0px 2px 3px #0A0A0A;
}
#qp .postInfo,
.inline .postInfo {
  box-shadow: none;
}
"""

  "4chan Rewired":
    "Author"                      : ""
    "Author Tripcode"             : "!K.WeEabo0o"
    "Background Color"            : "rgb(244,244,244)"
    "Dialog Background"           : "rgba(239,239,239,.98)"
    "Dialog Border"               : "rgb(212,212,212)"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Reply Background"            : "linear-gradient(rgba(244,244,244,0.9), rgba(239,239,239,0.9)), rgba(239,239,239,1)"
    "Reply Border"                : "rgb(212,212,212)"
    "Highlighted Reply Background": "linear-gradient(rgba(250,250,250,.9), rgba(230,230,230,0.9))"
    "Highlighted Reply Border"    : "rgb(191,127,63)"
    "Backlinked Reply Outline"    : "rgba(191,127,63,0.5)"
    "Checkbox Background"         : "rgba(228,228,228,.9)"
    "Checkbox Border"             : "rgb(204,204,204)"
    "Input Background"            : "rgba(244,244,244,0.9)"
    "Input Border"                : "rgb(204,204,204)"
    "Hovered Input Background"    : "rgba(212,212,212,.9)"
    "Hovered Input Border"        : "rgb(204,204,204)"
    "Focused Input Background"    : "rgba(212,212,212,.9)"
    "Focused Input Border"        : "rgb(204,204,204)"
    "Buttons Background"          : "rgba(244,244,244,0.9)"
    "Buttons Border"              : "rgb(204,204,204)"
    "Navigation Background"       : "rgba(244,244,244,0.8)"
    "Navigation Border"           : "rgb(239,239,239)"
    "Quotelinks"                  : "rgb(191,127,63)"
    "Links"                       : "rgb(191,127,63)"
    "Hovered Links"               : "rgb(191,127,63)"
    "Navigation Links"            : "rgba(0,0,0,.7)"
    "Hovered Navigation Links"    : "rgb(211,54,130)"
    "Subjects"                    : "rgba(0,0,0,.7)"
    "Names"                       : "rgba(0,0,0,.7)"
    "Sage"                        : "rgb(204,102,102)"
    "Tripcodes"                   : "rgb(191,127,63)"
    "Emails"                      : "rgb(191,127,63)"
    "Post Numbers"                : "rgb(191,127,63)"
    "Text"                        : "rgba(0,0,0,.7)"
    "Backlinks"                   : "rgb(191,127,63)"
    "Greentext"                   : "rgb(107,122,30)"
    "Board Title"                 : "rgba(0,0,0,.7)"
    "Timestamps"                  : "rgba(0,0,0,.7)"
    "Inputs"                      : "rgba(0,0,0,.7)"
    "Warnings"                    : "rgb(204,102,102)"
    "Shadow Color"                : "rgba(0,0,0,.07)"
    "Custom CSS"                  : """
.rice {
  box-shadow:rgba(255,255,255,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
.reply.post,
.op.post {
  background-color: transparent !important;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
a {
  -moz-transition: text-shadow .2s;
  -o-transition: text-shadow .2s;
  -webkit-transition: text-shadow .2s;
}
a:hover {
  text-shadow: 0 0 3px rgba(232,118,0,.7);
}
button,
input,
textarea,
.rice {
  transition:
    background .2s,
    box-shadow .2s;
}
.subject:not(:empty)::after {
  content: " by";
  font-weight: normal;
}
"""

  "4chan Dark Upgrade":
    "Author"                      : "Ahoka"
    "Author Tripcode"             : "!.pC/AHOKAg"
    "Background Image"            : "url(\"http://i.minus.com/iNkJoDJkLU0co.png\")"
    "Background Attachment"       : "fixed"
    "Background Position"         : "top left"
    "Background Repeat"           : "repeat"
    "Background Color"            : "rgb(36,36,36)"
    "Dialog Background"           : "rgba(51,51,51,.98)"
    "Dialog Border"               : "rgb(58,58,58)"
    "Thread Wrapper Background"   : "rgba(51,51,51,.5)"
    "Thread Wrapper Border"       : "rgba(58,58,58,.9)"
    "Reply Background"            : "rgba(51,51,51,.9)"
    "Reply Border"                : "rgb(58,58,58)"
    "Highlighted Reply Background": "rgba(47,47,47,.9)"
    "Highlighted Reply Border"    : "rgb(221,221,221)"
    "Backlinked Reply Outline"    : "rgb(221,221,221)"
    "Checkbox Background"         : "rgba(47,47,47,.9)"
    "Checkbox Border"             : "rgb(15,15,15)"
    "Input Background"            : "rgba(47,47,47,.9)"
    "Input Border"                : "rgb(15,15,15)"
    "Hovered Input Background"    : "rgba(31,31,31,.9)"
    "Hovered Input Border"        : "rgb(15,15,15)"
    "Focused Input Background"    : "rgba(31,31,31,.9)"
    "Focused Input Border"        : "rgb(15,15,15)"
    "Buttons Background"          : "rgba(47,47,47,.9)"
    "Buttons Border"              : "rgb(15,15,15)"
    "Navigation Background"       : "rgba(36,36,36,0.8)"
    "Navigation Border"           : "rgb(51,51,51)"
    "Quotelinks"                  : "rgb(221,221,221)"
    "Links"                       : "rgb(221,221,221)"
    "Hovered Links"               : "rgb(238,238,238)"
    "Navigation Links"            : "rgb(255,255,255)"
    "Hovered Navigation Links"    : "rgb(238,238,238)"
    "Subjects"                    : "rgb(153,153,153)"
    "Names"                       : "rgb(255,255,255)"
    "Sage"                        : "rgb(177,115,133)"
    "Tripcodes"                   : "rgb(167,220,231)"
    "Emails"                      : "rgb(221,221,221)"
    "Post Numbers"                : "rgb(221,221,221)"
    "Text"                        : "rgb(255,255,255)"
    "Backlinks"                   : "rgb(221,221,221)"
    "Greentext"                   : "rgb(99,153,91)"
    "Board Title"                 : "rgb(255,255,255)"
    "Timestamps"                  : "rgb(170,170,170)"
    "Inputs"                      : "rgb(255,255,255)"
    "Warnings"                    : "rgb(177,115,133)"
    "Shadow Color"                : "rgba(0,0,0,0.2)"
    "Custom CSS"                  : """
html {
}
.thread {
  padding: 3px 4px;
}
.rice {
  box-shadow:rgba(83,83,83,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
#delform {
  background: rgba(22,22,22,.8) !important;
  border: 0 !important;
  padding: 1px !important;
  box-shadow: rgba(0,0,0,.8) 0 0 10px;
}
div.reply.post {
  background-image:    -moz-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;
  background-image:      -o-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;
  background-image: -webkit-repeating-linear-gradient(45deg, #303030, #292929, #303030, #303030 3px) !important;
  border-bottom:#1f1f1f!important;
}
.thread:not(.stub) {
  background: 0 !important
}
a:not([href='javascript:;']){
  text-shadow: #0f0f0f 0 1px;
}
"""

  "安心院なじみ ":
    "Author"                      :"Ahoka"
    "Author Tripcode"             : "!.pC/AHOKAg"
    "Background Image"            : "url(\"http://i.imgur.com/RewHm.png\")"
    "Background Attachment"       : "fixed"
    "Background Position"         : "bottom right"
    "Background Repeat"           : "no-repeat"
    "Background Color"            : "rgb(255,255,255)"
    "Dialog Background"           : "rgba(239,239,239,.98)"
    "Dialog Border"               : "rgb(214,214,214)"
    "Thread Wrapper Background"   : "rgba(239,239,239,.4)"
    "Thread Wrapper Border"       : "rgba(214,214,214,.9)"
    "Reply Background"            : "rgba(239,239,239,.9)"
    "Reply Border"                : "rgb(214,214,214)"
    "Highlighted Reply Background": "rgba(235,235,235,.9)"
    "Highlighted Reply Border"    : "rgb(191,128,64)"
    "Backlinked Reply Outline"    : "rgb(191,128,64)"
    "Checkbox Background"         : "rgba(204,204,204,.9)"
    "Checkbox Border"             : "rgb(187,187,187)"
    "Input Background"            : "rgba(204,204,204,.9)"
    "Input Border"                : "rgb(187,187,187)"
    "Hovered Input Background"    : "rgba(188,188,188,.9)"
    "Hovered Input Border"        : "rgb(187,187,187)"
    "Focused Input Background"    : "rgba(188,188,188,.9)"
    "Focused Input Border"        : "rgb(187,187,187)"
    "Buttons Background"          : "rgba(204,204,204,.9)"
    "Buttons Border"              : "rgb(187,187,187)"
    "Navigation Background"       : "rgba(255,255,255,0.8)"
    "Navigation Border"           : "rgb(239,239,239)"
    "Quotelinks"                  : "rgb(191,128,64)"
    "Links"                       : "rgb(191,128,64)"
    "Hovered Links"               : "rgb(191,128,64)"
    "Navigation Links"            : "rgb(77,77,76)"
    "Hovered Navigation Links"    : "rgb(191,128,64)"
    "Subjects"                    : "rgb(77,77,77)"
    "Names"                       : "rgb(43,128,194)"
    "Sage"                        : "rgb(200,40,41)"
    "Tripcodes"                   : "rgb(62,153,159)"
    "Emails"                      : "rgb(191,128,64)"
    "Post Numbers"                : "rgb(191,128,64)"
    "Text"                        : "rgb(77,77,76)"
    "Backlinks"                   : "rgb(191,128,64)"
    "Greentext"                   : "rgb(113,140,0)"
    "Board Title"                 : "rgb(77,77,76)"
    "Timestamps"                  : "rgb(77,77,76)"
    "Inputs"                      : "rgb(77,77,76)"
    "Warnings"                    : "rgb(200,40,41)"
    "Shadow Color"                : "rgba(0,0,0,.05)"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(255,255,255,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow: inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow: inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition: background .2s,box-shadow .2s;
}"""

  "violaceous":
    "Author"                      : "Anonymous"
    "Author Tripcode"             : "!MaSoOdDwDw"
    "Background Color"            : "rgb(18,19,20)"
    "Dialog Background"           : "rgba(27,27,27,.98)"
    "Dialog Border"               : "rgb(41,42,43)"
    "Thread Wrapper Background"   : "rgba(27,27,27,.5)"
    "Thread Wrapper Border"       : "rgba(41,42,43,.9)"
    "Reply Background"            : "rgba(27,27,27,.9)"
    "Reply Border"                : "rgba(27,27,27,.9)"
    "Highlighted Reply Background": "rgba(31,31,31,.9)"
    "Highlighted Reply Border"    : "rgb(42,127,160)"
    "Backlinked Reply Outline"    : "rgb(42,127,160)"
    "Checkbox Background"         : "rgba(24,25,26,.9)"
    "Checkbox Border"             : "rgb(18,19,20)"
    "Input Background"            : "rgba(24,25,26,.9)"
    "Input Border"                : "rgb(18,19,20)"
    "Hovered Input Background"    : "rgba(40,41,42,.9)"
    "Hovered Input Border"        : "rgb(18,19,20)"
    "Focused Input Background"    : "rgba(40,41,42,.9)"
    "Focused Input Border"        : "rgb(18,19,20)"
    "Buttons Background"          : "rgba(24,25,26,.9)"
    "Buttons Border"              : "rgb(18,19,20)"
    "Navigation Background"       : "rgba(18,19,20,0.8)"
    "Navigation Border"           : "rgb(27,27,27)"
    "Quotelinks"                  : "rgb(42,127,160)"
    "Links"                       : "rgb(42,127,160)"
    "Hovered Links"               : "rgb(48,144,181)"
    "Navigation Links"            : "rgb(221,221,221)"
    "Hovered Navigation Links"    : "rgb(48,144,181)"
    "Subjects"                    : "rgb(6,152,154)"
    "Names"                       : "rgb(164,151,176)"
    "Sage"                        : "rgb(79,79,79)"
    "Tripcodes"                   : "rgb(189,43,131)"
    "Emails"                      : "rgb(42,127,160)"
    "Post Numbers"                : "rgb(42,127,160)"
    "Text"                        : "rgb(221,221,221)"
    "Backlinks"                   : "rgb(42,127,160)"
    "Greentext"                   : "rgb(0,171,63)"
    "Board Title"                 : "rgb(221,221,221)"
    "Timestamps"                  : "rgb(221,221,221)"
    "Inputs"                      : "rgb(221,221,221)"
    "Warnings"                    : "rgb(79,79,79)"
    "Shadow Color"                : "rgba(0,0,0,.1)"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(59,59,59,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}
"""

  "Mesa":
    "Author"                      : "Tristan"
    "Author Tripcode"             : "!..NoTrip.."
    "Background Color"            : "#3c212a"
    "Thread Wrapper Background"   : "rgba(0,0,0,0)"
    "Thread Wrapper Border"       : "rgba(0,0,0,0)"
    "Dialog Background"           : "#3c212a"
    "Dialog Border"               : "#171717"
    "Reply Background"            : "#3c212a"
    "Reply Border"                : "#171717"
    "Highlighted Reply Background": "#3c212a"
    "Highlighted Reply Border"    : "#bfa977"
    "Backlinked Reply Outline"    : "#bfa977"
    "Input Background"            : "#3c212a"
    "Input Border"                : "#171717"
    "Checkbox Background"         : "#3c212a"
    "Checkbox Border"             : "#171717"
    "Buttons Background"          : "#3c212a"
    "Buttons Border"              : "#171717"
    "Focused Input Background"    : "#3c212a"
    "Focused Input Border"        : "#171717"
    "Hovered Input Background"    : "#3c212a"
    "Hovered Input Border"        : "#171717"
    "Navigation Background"       : "#3c212a"
    "Navigation Border"           : "#171717"
    "Quotelinks"                  : "#bfa977"
    "Backlinks"                   : "#bfa977"
    "Links"                       : "#bfa977"
    "Hovered Links"               : "#aa4775"
    "Navigation Links"            : "#bfa977"
    "Hovered Navigation Links"    : "#aa4775"
    "Names"                       : "#bfa977"
    "Tripcodes"                   : "#aa6d89"
    "Emails"                      : "#9c8aaa"
    "Subjects"                    : "#bfa977"
    "Text"                        : "#BFA977"
    "Inputs"                      : "#bfa977"
    "Post Numbers"                : "#bfa977"
    "Greentext"                   : "#99848b"
    "Sage"                        : "rgb(150,150,150)"
    "Board Title"                 : "#aa9d8d"
    "Timestamps"                  : "#aa9d8d"
    "Warnings"                    : "#aa8575"
    "Shadow Color"                : "rgba(0,0,0,.1)"
    "Custom CSS"                  : ""
    "Background Image"            : ""
    "Background Attachment"       : ""
    "Background Position"         : ""
    "Background Repeat"           : ""

  "White Rainbow":
    "Author"                      : "Shiro"
    "Author Tripcode"             : "!i.Neko0OEM"
    "Background Image"            : "url('http://subtlepatterns.com/patterns/paper_fibers.png')"
    "Background Attachment"       : "fixed"
    "Background Position"         : "top left"
    "Background Repeat"           : "repeat"
    "Background Color"            : "rgb(255,255,255)"
    "Dialog Background"           : "rgba(239,239,239,.98)"
    "Dialog Border"               : "rgb(214,214,214)"
    "Thread Wrapper Background"   : "rgba(239,239,239,.98)"
    "Thread Wrapper Border"       : "rgba(214,214,214,.4)"
    "Reply Background"            : "rgba(255,255,255,.90)"
    "Reply Border"                : "rgb(214,214,214)"
    "Highlighted Reply Background": "rgba(239,239,239,.90)"
    "Highlighted Reply Border"    : "#b84818"
    "Backlinked Reply Outline"    : "#b84818"
    "Checkbox Background"         : "rgba(239,239,239,.98)"
    "Checkbox Border"             : "rgb(187,187,187)"
    "Checkbox Checked Background" : "rgba(239,239,239,.98)"
    "Input Background"            : "#fffffff"
    "Input Border"                : "rgb(187,187,187)"
    "Hovered Input Background"    : "#f0f0f0"
    "Hovered Input Border"        : "rgb(187,187,187)"
    "Focused Input Background"    : "#f0f0f0"
    "Focused Input Border"        : "rgb(187,187,187)"
    "Buttons Background"          : "rgba(239,239,239,.98)"
    "Buttons Border"              : "rgb(187,187,187)"
    "Navigation Background"       : "rgba(255,255,255,0.8)"
    "Navigation Border"           : "rgb(239,239,239)"
    "Quotelinks"                  : "#7a2634"
    "Links"                       : "#7a2634"
    "Hovered Links"               : "#c24646"
    "Navigation Links"            : "#404d41"
    "Hovered Navigation Links"    : "#527054"
    "Subjects"                    : "#5533ff"
    "Names"                       : "#242ca3"
    "Sage"                        : "#6910ad"
    "Tripcodes"                   : "#0c76ab"
    "Emails"                      : "#0c76ab"
    "Post Numbers"                : "#b86e2e"
    "Text"                        : "#242423"
    "Backlinks"                   : "#7a2634"
    "Greentext"                   : "#10610a"
    "Board Title"                 : "#000000"
    "Timestamps"                  : "#00913f"
    "Inputs"                      : "#242423"
    "Warnings"                    : "rgb(200,40,41)"
    "Shadow Color"                : "#b0b0b0"
    "Custom CSS"                  : """
.thread {
  padding: 1px;
}
.rice {
  box-shadow:rgba(255,255,255,.3) 0 1px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#options input:not([type=checkbox]):hover {
  box-shadow: inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#options input:focus {
  box-shadow: inset rgba(200,200,200,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition: background .2s,box-shadow .2s;
}"""

  "Genergray":
    "Author":                       "Zixaphir"
    "Author Tripcode":              "!M........."
    "Background Image":             ""
    "Background Attachment":        ""
    "Background Position":          ""
    "Background Repeat":            ""
    "Background Color":             "rgba(32,32,32,1)"
    "Thread Wrapper Background":    "rgba(24,24,24,1)"
    "Thread Wrapper Border":        "rgba(30,30,30,1)"
    "Dialog Background":            "rgba(32,32,32,1)"
    "Dialog Border":                "rgba(20,20,20,1)"
    "Reply Background":             "rgba(32,32,32,1)"
    "Reply Border":                 "rgba(20,20,20,1)"
    "Highlighted Reply Background": "rgba(24,24,24,1)"
    "Highlighted Reply Border":     "rgba(24,24,24,1)"
    "Backlinked Reply Outline":     "rgba(98,124,141,1)"
    "Input Background":             "rgba(32,32,32,1)"
    "Input Border":                 "rgba(28,28,28,1)"
    "Hovered Input Background":     "rgba(24,24,24,1)"
    "Hovered Input Border":         "rgba(24,24,24,1)"
    "Focused Input Background":     "rgba(16,16,16,1)"
    "Focused Input Border":         "rgba(28,28,28,1)"
    "Checkbox Background":          "rgb(25,25,25)"
    "Checkbox Border":              "rgb(20,20,20)"
    "Checkbox Checked Background":  "rgb(25,25,25)"
    "Buttons Background":           "rgba(20,20,20,1)"
    "Buttons Border":               "rgb(16,16,16)"
    "Navigation Background":        "rgba(16,16,16,0.9)"
    "Navigation Border":            "rgba(16,16,16,0.9)"
    "Quotelinks":                   "rgb(71,140,161)"
    "Backlinks":                    "rgba(71,140,161, 0.8)"
    "Links":                        "rgb(141,141,160)"
    "Hovered Links":                "rgb(141,190,255)"
    "Navigation Links":             "rgb(51,145,175)"
    "Hovered Navigation Links":     "rgb(141,190,255)"
    "Names":                        "rgb(150,150,150)"
    "Tripcodes":                    "rgb(255,255,255)"
    "Emails":                       "rgb(68,68,68)"
    "Subjects":                     "rgb(255,100,100)"
    "Text":                         "rgb(235,255,235)"
    "Inputs":                       "rgb(144,144,144)"
    "Post Numbers":                 "rgb(150,150,150)"
    "Greentext":                    "rgb(113,121,62)"
    "Sage":                         "rgb(68,68,68)"
    "Board Title":                  "rgb(194,194,194)"
    "Timestamps":                   "rgb(100,100,100)"
    "Warnings":                     "rgb(215,0,0)"
    "Shadow Color":                 "rgba(0,0,0,.1)"
    "Custom CSS": """
.thread {
  padding: 2px;
}
#header-bar,
input,
textarea,
.field,
.inline .op,
.pagelist,
.prettyprint,
.post.reply,
.rice,
.selectrice {
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2) inset, rgba(70,70,70,.3) 1px 1px;
}
#qr .selectrice {
  box-shadow: none;
}
.thread {
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3) inset, rgba(70,70,70,.5) 1px 1px;
}
#header-bar {
  padding: 1px 3px;
}
.dialog {
  box-shadow: 0px 0px 4px rgba(0, 0, 0, .3) inset, 1px 1px 5px rgba(0,0,0,0.2);
}
.threadContainer {
  border: none;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, .3) inset, rgba(70,70,70,.3) 1px 1px;
  padding-bottom: 2px;
  padding-top: 2px;
}
input[type=password]:hover,
input[type=text]:not([disabled]):hover,
input#fs_search:hover,
input.field:hover,
.webkit select:hover,
textarea:hover,
#appchanx-settings input:not([type=checkbox]):hover {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
input[type=password]:focus,
input[type=text]:focus,
input#fs_search:focus,
input.field:focus,
.webkit select:focus,
textarea:focus,
#appchanx-settings input:focus {
  box-shadow:inset rgba(0,0,0,.2) 0 1px 2px;
}
button,
input,
textarea,
.rice {
  transition:background .2s,box-shadow .2s;
}"""

Icons =
  oneechan:   '<%= grunt.file.read("src/General/img/icons/oneechan.png", {encoding: "base64"}) %>'
  "4chan SS": '<%= grunt.file.read("src/General/img/icons/4chanSS.png",  {encoding: "base64"}) %>'
