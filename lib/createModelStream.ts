export async function* handleStreamResponse(
  response: Response
): AsyncGenerator<StreamResponse> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is null");
  }

  const decoder = new TextDecoder();
  let accumulatedText = "";

  yield {
    status: { type: "running" },
    content: [{ type: "text", text: accumulatedText }],
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        yield {
          status: { type: "complete", reason: "stop" },
          content: [{ type: "text", text: accumulatedText }],
        };
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(5).trim();

          if (data === "[DONE]") return;

          try {
            const { content } = JSON.parse(data);
            accumulatedText += content;

            yield {
              status: { type: "running" },
              content: [{ type: "text", text: accumulatedText }],
            };
          } catch (e) {
            yield {
              status: { type: "incomplete", reason: "error", error: String(e) },
              content: [{ type: "text", text: accumulatedText }],
            };
          }
        }
      }
    }
  } catch (error) {
    yield {
      status: { type: "incomplete", reason: "error", error: String(error) },
      content: [{ type: "text", text: accumulatedText }],
    };
  } finally {
    reader.releaseLock();
  }
}
