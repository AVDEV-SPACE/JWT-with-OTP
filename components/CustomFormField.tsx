'use client'
import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import Image from 'next/image';
import { E164Number } from "libphonenumber-js/core";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import AppointmentDatePicker from './AppointmentDatePicker' 
import { cn } from '@/lib/utils'

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phone_input",
    CHECKBOX = "checkbox",
    DATE_PICKER = "date_picker",
    SELECT = "select",
    SKELETON = "skeleton",
}

interface CustomProps {
    control: Control<any>;
    fieldType: FormFieldType;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    className?: string;
    labelClassName?: string;
    selectedDoctor?: string;
    appointment?: any;
    onChange?: (date: Date) => void;
    bookedTimes?: Date[];
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, renderSkeleton } = props;

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex border_unv bg-black/80 rounded-lg items-center">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='shad-input rounded-lg bg-black/80 text-white placeholder:text-gray-400'
                        />
                    </FormControl>
                </div>
            );

        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="RO"
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className='input-phone border_unv bg-black/80 text-white placeholder:text-gray-400 rounded-lg' 
                        inputClassName='bg-transparent text-white placeholder:text-gray-400' // Added input-specific class
                    />
                </FormControl>
            );

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="border rounded-lg bg-black/80 p-2 text-white placeholder:text-gray-400"
                        disabled={props.disabled}
                    />
                </FormControl>
            );

        case FormFieldType.DATE_PICKER:
            return (
                <FormControl>
                    <AppointmentDatePicker
                        className="border_unv bg-black/80 rounded-lg"
                        selectedDoctorId={props.selectedDoctor || ''}
                        appointment={props.appointment}
                        onDateTimeSelect={(date: Date) => {
                            field.onChange(date);
                            if (props.onChange) {
                                props.onChange(date);
                            }
                        }}
                        dateFormat={props.dateFormat}
                        showTimeSelect={props.showTimeSelect}
                        bookedTimes={props.bookedTimes}
                    />
                </FormControl>
        );

        case FormFieldType.SELECT:
            return (
            <FormControl className='border_unv bg-black/80 rounded-lg'>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className="text-white placeholder:text-gray-400">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-black/80 text-white' style={{ zIndex: 1100 }}>
                        {props.children}
                    </SelectContent>
                </Select>
            </FormControl>
        );

        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;

        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className='flex items-center gap-4'>
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name} className={cn('checkbox-label', props.labelClassName || 'text-white')}>
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            );
        default:
            return null;
    }
};

const CustomFormField = (props: CustomProps) => {
    const { control, fieldType, name, label, className, labelClassName } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex-1", className)}>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel className={cn("shad-form-label", labelClassName || "text-white")}>
                            {label}
                        </FormLabel>
                    )}

                    <RenderField field={field} props={props} />

                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    );
};

export default CustomFormField;