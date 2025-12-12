import React from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddContest() {
  const { register, handleSubmit, setValue } = useForm();
  const [deadline, setDeadline] = React.useState(new Date());

  const onSubmit = (data) => {
    console.log("Contest Data:", { ...data, deadline });
    // TODO: POST request to server
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Contest</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <input {...register("name")} placeholder="Contest Name" className="input" required />
        <input {...register("image")} placeholder="Image URL" className="input" />
        <textarea {...register("description")} placeholder="Description" className="input" />
        <input {...register("price")} placeholder="Price" type="number" className="input" />
        <input {...register("prize")} placeholder="Prize Money" type="number" className="input" />
        <textarea {...register("taskInstruction")} placeholder="Task Instruction" className="input" />
        <input {...register("type")} placeholder="Contest Type" className="input" />
        <div>
          <label className="block mb-1">Deadline:</label>
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            className="input"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Contest</button>
      </form>
    </div>
  );
}
