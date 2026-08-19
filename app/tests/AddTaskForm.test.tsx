import { render, screen } from "@testing-library/react";
import { describe, vi, beforeEach, it, expect } from "vitest";
import userEvent from '@testing-library/user-event'
import { addTask } from "../actions";
import AddTaskForm from "../component/AddTaskForm";

// mocking the entire actions module

vi.mock("../actions", () => ({
  addTask: vi.fn(),
}));

describe("AddTask component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and submit button properly", () => {
    render(<AddTaskForm />);

    expect(screen.getByPlaceholderText(/Add new Task/i));
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });
  it("handels laoding state (isPending) during form submissing", async() => {
    const user = userEvent.setup();
    // this get the exact return type of the server action function
    type ActionReturnType = Awaited<ReturnType<typeof addTask>>

    let resolveAction!: (value: ActionReturnType) => void
    const delayedPromise = new Promise<ActionReturnType>((resolve) => {
        resolveAction = resolve;
    });

    vi.mocked(addTask).mockReturnValue(delayedPromise)

    render(<AddTaskForm />);

    const input = screen.getByPlaceholderText(/Add new Task.../i)

    const button = screen.getByRole('button', {name: /add/i})

    await user.type(input, 'Learn Vitest in 2026');
    await user.click(button);

    expect(button).toHaveTextContent('Adding..');
    expect(button).toBeDisabled()
    expect(input).toBeDisabled()
  // 3. Resolve with a type-safe object matching your ActionReturnType

    resolveAction({success: true})
 

  
  });
});
