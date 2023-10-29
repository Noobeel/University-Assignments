import React, { ReactElement } from 'react';
import { Field } from 'formik';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Textarea,
    TextareaProps,
    useColorModeValue,
} from '@chakra-ui/react';

type InputFormControlType = {
    errors: string | undefined;
    touched: boolean | undefined;
    label?: string;
    labelComponent?: ReactElement;
    /**
     * Only provide submit button component if form is 1 input
     */
    submitButton?: ReactElement;
    name: string;
    type?: string;
    placeholder?: string;
    isRequired?: boolean;
    textArea?: { resize: TextareaProps['resize'] };
    [rest: string]: any;
};

export const InputFormControl = ({
    errors,
    touched,
    name,
    label = '',
    labelComponent,
    submitButton,
    isRequired = false,
    placeholder = '',
    textArea,
    type = 'text',
    ...rest
}: InputFormControlType) => {
    const inputColor = useColorModeValue('white', 'black');
    const getInputComponent = () => {
        if (textArea) return Textarea;
        return Input;
    };
    return (
        <FormControl isRequired={isRequired} isInvalid={!!errors && touched}>
            {labelComponent ? (
                labelComponent
            ) : (
                <FormLabel htmlFor={name}>{label}</FormLabel>
            )}
            <HStack>
                <Field
                    as={getInputComponent()}
                    id={name}
                    resize={textArea?.resize}
                    name={name}
                    type={type}
                    bg={inputColor}
                    placeholder={placeholder}
                    {...rest}
                />
                {submitButton}
            </HStack>
            <FormErrorMessage>{errors}</FormErrorMessage>
        </FormControl>
    );
};
