import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const MarkdownLatex = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div className={`prose-soal ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownLatex;
