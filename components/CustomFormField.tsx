/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useRef } from 'react';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { E164Number } from "libphonenumber-js/core";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  dateFormat?: string;
  showTimeSelect?: boolean;
  renderSkeleton?: (field: any) => React.ReactNode;
  iconSrc?: string;
  iconAlt?: string;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    placeholder,
    label,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;

  const datePickerRef = useRef(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      
      datePickerRef.current.setFocus(); 
    }
  };

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex border rounded border-dark-500 bg-dark-400 items-center">
          {label === "Email" ? (
            <FontAwesomeIcon icon={faEnvelope} className="ml-2" />
          ) : label === "Full Name" ? (
            <FontAwesomeIcon icon={faUser} className="ml-2" />
          ) : null}

          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox 
            id={props.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            />

            <Label htmlFor={props.name} className="cursor-pointer">
              {label}
            </Label>
          </div>
        </FormControl>
    )
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea 
          placeholder={placeholder}
          {...field}
          className="shad-textarea"
          disabled={props.disabled}
          />
        </FormControl>
    )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="GH"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex border rounded border-dark-500 bg-dark-400 items-center">
          <div onClick={handleIconClick} className="cursor-pointer mx-2">
        <FontAwesomeIcon icon={faCalendar} />
      </div>

          <FormControl>
            <DatePicker
              ref={datePickerRef}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              className="text-sm"
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
              placeholderText={props.name === "schedule" 
                ? "Select appointment date and time" 
                : props.name === "birthDate" 
                  ? "Select date of birth" 
                  : ""}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.SELECT:
      return (
        <FormControl>
         <Select 
         onValueChange={field.onChange}
         defaultValue={field.value}
         >
          <FormControl >
            <SelectTrigger className="shad-select-trigger">
            <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
         </Select>
         
        </FormControl>
      )
      default:
      break;
  }
};

function CustomFormField(props: CustomProps) {
  const { control, fieldType, name, label } = props;




  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
}

export default CustomFormField;
