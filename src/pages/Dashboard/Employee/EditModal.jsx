import {
  Input,
  Option,
  Select,
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditModal = ({
  show,
  onClose,
  onSubmit,
  register,
  handleSubmit,
  setValue,
  watch,
  errors,
  date,
  setDate,
  taskOptions,
  loading,
}) => {
  return (
    <Dialog size="sm" open={show} handler={onClose} className="p-4">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          Edit Work Entry
        </Typography>
        <Typography className="mt-1 font-normal text-gray-600">
          Update your worksheet entry details.
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={onClose}
        >
          <IoClose className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody className="space-y-4 pb-6">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Task
            </Typography>
            <Select
              className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 placeholder:text-gray-600 focus:!border-primary"
              labelProps={{
                className: "hidden",
              }}
              value={watch("task") || ""}
              onChange={(task) =>
                setValue("task", task, { shouldValidate: true })
              }
            >
              {taskOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
            {errors.task && (
              <Typography color="red" className="text-xs mt-1 block">
                Task is required
              </Typography>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Hours Worked
            </Typography>
            <Input
              color="gray"
              size="lg"
              type="number"
              min={0}
              step={0.1}
              placeholder="0.0"
              {...register("hoursWorked", { required: true, min: 0.1 })}
              className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 placeholder:text-gray-600 focus:!border-primary"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
            />
            {errors.hoursWorked && (
              <Typography color="red" className="text-xs mt-1 block">
                Enter valid hours
              </Typography>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Date
            </Typography>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              maxDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 placeholder:text-gray-600 focus:!border-primary rounded-md py-2 px-3"
              placeholderText="Select date"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            color="gray"
            variant="text"
            className="mr-2"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button color="blue" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default EditModal;
