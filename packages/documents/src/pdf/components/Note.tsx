import type { JSONContent } from "@carbon/react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const convertTiptapJSON = (
  node: JSONContent,
  args?: {
    index?: number;
    parentNodeType?: string;
    title?: string;
  }
) => {
  switch (node.type) {
    case "doc":
      return (
        <View style={{ fontSize: 9 }}>
          {args?.title && (
            <View style={styles.thead}>
              <Text>{args?.title}</Text>
            </View>
          )}
          {node?.content?.map((child, index) => convertTiptapJSON(child))}
        </View>
      );

    case "heading":
      return (
        <Text
          key={`heading-${node.attrs.level}`}
          style={{
            fontSize: 13,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {node?.content?.map((child) => convertTiptapJSON(child))}
        </Text>
      );

    case "paragraph":
      return (
        <Text key="paragraph" style={{ marginBottom: 10, fontSize: 9 }}>
          {node.content?.map((child) => convertTiptapJSON(child)) || ""}
        </Text>
      );

    case "bulletList":
      return (
        <View key="bulletList" style={{ marginLeft: 20 }}>
          {node?.content?.map((child, index) =>
            convertTiptapJSON(child, {
              index,
              parentNodeType: "bulletList",
            })
          )}
        </View>
      );

    case "orderedList":
      return (
        <View key="orderedList" style={{ marginLeft: 20 }}>
          {node?.content?.map((child, index) =>
            convertTiptapJSON(child, {
              index,
              parentNodeType: "orderedList",
            })
          )}
        </View>
      );

    case "listItem":
      const indicator =
        args.parentNodeType == "orderedList" ? `${args.index + 1}.` : "•";
      return (
        <View
          key={`listItem-${args.index}`}
          style={{ flexDirection: "row", marginBottom: 5 }}
        >
          <Text style={{ marginRight: 5, fontSize: 9 }}> {indicator} </Text>
          <View>
            {node?.content?.map((child, index) => convertTiptapJSON(child))}
          </View>
        </View>
      );

    case "taskList":
      return (
        <View key="taskList" style={{ marginLeft: 20 }}>
          {node?.content?.map((child, index) =>
            convertTiptapJSON(child, { index })
          )}
        </View>
      );

    case "taskItem":
      return (
        <View
          key={`taskItem-${args.index}`}
          style={{ flexDirection: "row", marginBottom: 5 }}
        >
          <Text style={{ marginRight: 5, fontSize: 9 }}>•</Text>
          <View>
            {node?.content?.map((child, index) => convertTiptapJSON(child))}
          </View>
        </View>
      );

    case "text":
      return node.text;

    case "image":
      return null;

    default:
      return null;
  }
};

const Note = ({ title, content }: { title?: string; content: JSONContent }) => {
  if (!content) return null;
  if (typeof content !== "object") return null;
  if (!("content" in content)) return null;
  if (!Array.isArray(content.content) || content.content.length === 0)
    return null;

  return <View>{convertTiptapJSON(content, { title })}</View>;
};

export default Note;

const styles = StyleSheet.create({
  thead: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "10px",
    padding: "6px 3px 6px 3px",
    borderTop: 1,
    borderTopColor: "#CCCCCC",
    borderTopStyle: "solid",
    borderBottom: 1,
    borderBottomColor: "#CCCCCC",
    borderBottomStyle: "solid",
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  tfoot: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 3px 6px 3px",
    borderTopStyle: "solid",
    borderBottom: 1,
    borderBottomColor: "#CCCCCC",
    borderBottomStyle: "solid",
    fontWeight: 700,
    color: "#7d7d7d",
    textTransform: "uppercase",
  },
});
