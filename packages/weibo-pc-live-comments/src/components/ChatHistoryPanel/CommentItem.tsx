import "./CommentItem.css";
import type { Comment } from "../../types/comment";

type CommentProps = {
  comment: Comment;
};

export default function CommentItem({ comment }: CommentProps) {
  const {
    user: { fansIcon, avatar_large },
  } = comment;

  return (
    <div className="comment-item" key={comment.id}>
      {avatar_large && <img src={avatar_large} className="avatar" alt="" />}
      <a
        href={`https://weibo.com/u/${comment.user.id}`}
        className="comment-user"
        target="_blank"
        rel="noopener noreferrer"
      >
        {comment.user.screen_name}
      </a>
      {fansIcon?.icon_url && (
        <img src={fansIcon.icon_url} className="fans-icon" alt="" />
      )}
      :
      <span
        dangerouslySetInnerHTML={{ __html: comment.text }}
        className="comment-text"
      ></span>
    </div>
  );
}
