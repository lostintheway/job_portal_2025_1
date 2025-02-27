import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  type?: string;
  label?: string;
  placeholder?: string;
};

const FormInput = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  type = "text",
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label ? label : name.charAt(0).toLocaleUpperCase() + name.slice(1)}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder ? placeholder : label}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
