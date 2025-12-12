import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditContest() {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const [deadline, setDeadline] = useState(new Date());

  useEffect(() => {
    fetch(`/api/creator/contest/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setValue("name", data.name);
        setValue("image", data.image);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("prize", data.prize);
        setValue("taskInstruction", data.taskInstruction);
        setValue("type", data.type);
        setDeadline(new Date(data.deadline));
      });
  }, [id]);

  const onSubmit = (data) => {
    fetch(`/api/creator/contest/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...data, deadline }),
    }).then(() => alert("Contest updated!"));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Contest</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <input {...register("name")} placeholder="Contest Name" className="input" />
        <input {...register("image")} placeholder="Image URL" className="input" />
        <textarea {...register("description")} placeholder="Description" className="input" />
        <input {...register("price")} placeholder="Price" type="number" className="input" />
        <input {...register("prize")} placeholder="Prize Money" type="number" className="input" />
        <textarea {...register("taskInstruction")} placeholder="Task Instruction" className="input" />
        <input {...register("type")} placeholder="Contest Type" className="input" />
        <DatePicker selected={deadline} onChange={(date) => setDeadline(date)} className="input" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Contest</button>
      </form>
    </div>
  );
}
