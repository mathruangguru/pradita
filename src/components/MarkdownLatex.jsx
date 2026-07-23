import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax/svg";

const normalizeSimpleSubscripts = (math) =>
  math.replace(/(?<![\\A-Za-z_])([A-Za-z])([0-9]+)(?![A-Za-z])/g, "$1_{$2}");

const normalizeMathSubscripts = (source) =>
  source
    .replace(/(\$\$|\$)([\s\S]*?)\1/g, (match, delimiter, math) => {
      return `${delimiter}${normalizeSimpleSubscripts(math)}${delimiter}`;
    })
    .replace(/\\\(([\s\S]*?)\\\)/g, (match, math) => {
      return `$${normalizeSimpleSubscripts(math)}$`;
    })
    .replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
      return `$$${normalizeSimpleSubscripts(math)}$$`;
    });

const MarkdownLatex = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div className={`prose-soal ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
        {normalizeMathSubscripts(children)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownLatex;
