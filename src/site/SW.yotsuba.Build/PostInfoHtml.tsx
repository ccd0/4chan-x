import { g } from "../../globals/globals";
import h, { EscapedHtml } from "../../globals/jsx";

export default function generatePostInfoHtml(
  ID, o, subject, capcode, email, name, tripcode, pass, capcodeLC, capcodePlural, staticPath, gifIcon,
  capcodeDescription, uniqueID, flag, flagCode, flagCodeTroll, dateUTC, dateText, postLink, quoteLink, boardID,
  threadID,
): EscapedHtml {
  const nameHtml: (EscapedHtml | string)[] = [<span class={`name${capcode ? ' ' + capcode : ''}`}>{name}</span>];
  if (tripcode) nameHtml.push(' ', <span class="postertrip">{tripcode}</span>);
  if (pass) nameHtml.push(' ', <span title={`Pass user since ${pass}`} class="n-pu"></span>)
  if (capcode) {
    nameHtml.push(
      ' ',
      <strong class={`capcode hand id_${capcodeLC}`} title={`Highlight posts by ${capcodePlural}`}>## {capcode}</strong>
    )
  }

  const nameBlockContent: (EscapedHtml | string)[] =
    email ? [' ', <a href={`mailto:${email}`} class="useremail">{...nameHtml}</a>] : nameHtml;
  if (!(boardID === "f" && !o.isReply || capcodeDescription)) nameBlockContent.push(' ');
  if (capcodeDescription) {
    nameBlockContent.push(
      <img
        src={`${staticPath}${capcodeLC}icon${gifIcon}`}
        alt={`${capcode} Icon}`}
        title={`This user is ${capcodeDescription}.`}
        class="identityIcon retina"
      />
    );
    if (uniqueID && !capcode) {
      nameBlockContent.push(
        <span class={`posteruid id_${uniqueID}`}>
          (ID: <span class="hand" title="Highlight posts by this ID">${uniqueID}</span>)
        </span>
      )
    }
  }
  if (flagCode) nameBlockContent.push(' ', <span title={flag} class={`flag flag-${flagCode.toLowerCase()}`} />);
  if (flagCodeTroll) nameBlockContent.push(' ', <span title={flag} class={`bfl bfl-${flagCodeTroll.toLowerCase()}`} />);

  const postNumContent: (EscapedHtml | string)[] = [
    <a href={postLink} title="Link to this post">No.</a>,
    <a href={quoteLink} title="Reply to this post">{ID}</a>,
  ];

  if (o.isSticky) {
    const src = `${staticPath}sticky${gifIcon}`;
    postNumContent.push(' ');
    if (boardID === "f") {
      postNumContent.push(<img src={src} alt="Sticky" title="Sticky" style="height: 18px; width: 18px;" />);
    } else {
      postNumContent.push(<img src={src} alt="Sticky" title="Sticky" class="stickyIcon retina" />)
    }
  }
  if (o.isClosed && !o.isArchived) {
    postNumContent.push(' ');
    const src = `${staticPath}closed${gifIcon}`
    if (boardID === "f") {
      postNumContent.push(<img src={src} alt="Closed" title="Closed" style="height: 18px; width: 18px;" />)
    } else {
      postNumContent.push(<img src={src} alt="Closed" title="Closed" class="closedIcon retina" />)
    }
  }
  if (o.isArchived) {
    postNumContent.push(
      ' ',
      <img src={`${staticPath}archived${gifIcon}`} alt="Archived" title="Archived" class="archivedIcon retina" />
    )
  }
  if (!o.isReply && g.VIEW === "index") {
    // \u00A0 is nbsp
    postNumContent.push(' \u00A0 ')
    postNumContent.push(<span>[<a href={`/${boardID}/thread/${threadID}`} class="replylink">Reply</a>]</span>)
  }

  return <div class="postInfo desktop" id={`pi${ID}`}>
    <input type="checkbox" name={ID} value="delete" />
    {' '}
    {...((!o.isReply || boardID === "f" || subject) ? [<span class="subject">{subject}</span>, ' '] : [])}
    <span class={`nameBlock${capcode || ''}`}>
      {...nameBlockContent}
    </span>
    {' '}
    <span class="dateTime" data-utc={dateUTC}>{dateText}</span>
    {' '}
    <span class={`postNum${!(boardID === " f" && !o.isReply) ? ' desktop' : ''}`} >
      {...postNumContent}
    </span>
  </div>;
}
