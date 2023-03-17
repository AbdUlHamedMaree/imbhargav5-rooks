import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { useIsDroppingFiles } from "@/hooks/useIsDroppingFiles";

describe("useIsDroppingFiles", () => {
  it("handles file dragging and dropping on HTMLElement", async () => {
    expect.hasAssertions();
    const TestComponent = () => {
      const [ref, isDropping] = useIsDroppingFiles();
      return (
        <div
          ref={ref}
          data-testid="drop-zone"
          style={{ backgroundColor: isDropping ? "red" : "white" }}
        >
          Drop here
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const dropZone = getByTestId("drop-zone");

    expect(dropZone).toHaveStyle("background-color: white");

    act(() => {
      fireEvent.dragEnter(dropZone, {
        dataTransfer: {
          files: [
            {
              name: "test-file",
              size: 100,
              type: "text/plain",
            },
          ],
        },
      });
    });

    await waitFor(() => expect(dropZone).toHaveStyle("background-color: red"));

    act(() => {
      fireEvent.dragLeave(dropZone);
    });

    await waitFor(() =>
      expect(dropZone).toHaveStyle("background-color: white")
    );
  });

  it("handles file dragging and dropping on the window object", async () => {
    expect.hasAssertions();
    const TestComponent = () => {
      const isDropping = useIsDroppingFiles(true);
      return (
        <div
          data-testid="window-drop-zone"
          style={{ backgroundColor: isDropping ? "red" : "white" }}
        >
          Drop here
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const windowDropZone = getByTestId("window-drop-zone");

    expect(windowDropZone).toHaveStyle("background-color: white");

    act(() => {
      fireEvent.dragEnter(window, {
        dataTransfer: {
          files: [
            {
              name: "test-file",
              size: 100,
              type: "text/plain",
            },
          ],
        },
      });
    });

    await waitFor(() =>
      expect(windowDropZone).toHaveStyle("background-color: red")
    );

    act(() => {
      fireEvent.dragLeave(window);
    });

    await waitFor(() =>
      expect(windowDropZone).toHaveStyle("background-color: white")
    );
  });
});
