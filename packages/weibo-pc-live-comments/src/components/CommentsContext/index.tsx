import { createContext, useState, useEffect, useContext } from "react";
import type { Comment } from "../../types/comment";

type CommentsContextType = {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined,
);

export const CommentsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Comment[]>;
      setComments((prev) => {
        const merged = [...prev, ...ce.detail];
        return merged.slice(-50); // 保持最多 50 条
      });
    };
    window.addEventListener("update-comments", handler);
    return () => window.removeEventListener("update-comments", handler);
  }, []);

  return (
    <CommentsContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used within CommentsProvider");
  return ctx;
};
