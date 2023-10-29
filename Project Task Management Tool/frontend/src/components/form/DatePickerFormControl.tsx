import { Box, chakra, HStack, Text } from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useField, useFormikContext } from 'formik';
import React, { useEffect } from 'react';

interface Props {
    name: string;
    label: string;
}
export const DatePickerFormControl = React.memo(({ name, label }: Props) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(name);

    return (
        <Box w='full'>
            <Text mb='1'>{label}</Text>

            <SingleDatepicker
                date={field.value}
                onDateChange={(date) => {
                    setFieldValue(field.name, date);
                }}
            />
        </Box>
    );
});
