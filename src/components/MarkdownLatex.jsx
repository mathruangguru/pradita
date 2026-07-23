import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";

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
  const containerRef = useRef(null);

  useEffect(() => {
    const typeset = () => {
      if (window.MathJax?.typesetPromise && containerRef.current) {
        window.MathJax.typesetPromise([containerRef.current]);
      }
    };

    typeset();
    window.addEventListener("load", typeset);
    return () => window.removeEventListener("load", typeset);
  }, [children]);

  if (!children) return null;

  return (
    <div ref={containerRef} className={`prose-soal ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        components={{
          code({ className: codeClassName, children: codeChildren, ...props }) {
            const value = String(codeChildren).replace(/\n$/, "");
            const isMath = codeClassName?.includes("language-math");
            const isInline = codeClassName?.includes("math-inline");

            if (isMath) {
              return isInline ? (
                <span className="math-source">{`\\(${value}\\)`}</span>
              ) : (
                <span className="math-source math-source-display">
                  {`\\[${value}\\]`}
                </span>
              );
            }

            return (
              <code className={codeClassName} {...props}>
                {codeChildren}
              </code>
            );
          },
          pre({ children: preChildren }) {
            return <>{preChildren}</>;
          },
        }}
      >
        {normalizeMathSubscripts(children)}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownLatex;
