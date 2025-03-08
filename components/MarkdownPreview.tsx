import { MakeMarkdownTextProps } from "@assistant-ui/react-markdown";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";

export const MarkdownPreview = ({ children }: { children: string }) => (
  <ReactMarkdown components={defaultComponents}>{children}</ReactMarkdown>
);

const defaultComponents: MakeMarkdownTextProps["components"] = {
  h1: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h2: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h3: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h4: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h5: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  h6: ({ node, className, ...props }) => (
    <h6 className={classNames("aui-md-h6", className)} {...props} />
  ),
  p: ({ node, className, ...props }) => (
    <p className={classNames("aui-md-p", className)} {...props} />
  ),
  a: ({ node, className, ...props }) => (
    <a className={classNames("aui-md-a", className)} {...props} />
  ),
  blockquote: ({ node, className, ...props }) => (
    <blockquote
      className={classNames("aui-md-blockquote", className)}
      {...props}
    />
  ),
  ul: ({ node, className, ...props }) => (
    <ul className={classNames("aui-md-ul", className)} {...props} />
  ),
  ol: ({ node, className, ...props }) => (
    <ol className={classNames("aui-md-ol", className)} {...props} />
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={classNames("aui-md-hr", className)} {...props} />
  ),
  table: ({ node, className, ...props }) => (
    <table className={classNames("aui-md-table", className)} {...props} />
  ),
  th: ({ node, className, ...props }) => (
    <th className={classNames("aui-md-th", className)} {...props} />
  ),
  td: ({ node, className, ...props }) => (
    <td className={classNames("aui-md-td", className)} {...props} />
  ),
  tr: ({ node, className, ...props }) => (
    <tr className={classNames("aui-md-tr", className)} {...props} />
  ),
  sup: ({ node, className, ...props }) => (
    <sup className={classNames("aui-md-sup", className)} {...props} />
  ),
  pre: ({ node, className, ...props }) => (
    <pre className={classNames("aui-md-pre", className)} {...props} />
  ),
};
