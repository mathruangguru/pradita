import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const normalizeMathSubscripts = (source) =>
  source.replace(/(\$\$|\$)([\s\S]*?)\1/g, (match, delimiter, math) => {
    const normalized = math.replace(
      /(?<![\\A-Za-z])([A-Za-z])([0-9]+)(?![A-Za-z])/g,
      "$1_{$2}",
    );

    return `${delimiter}${normalized}${delimiter}`;
  });

const MarkdownLatex = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div className={`prose-soal ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {normalizeMathSubscripts(children)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownLatex;
