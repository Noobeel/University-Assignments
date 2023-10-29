import { extendTheme } from '@chakra-ui/react';
import { StyleFunctionProps, mode } from '@chakra-ui/theme-tools';

export const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    colors: {
        gray: {
            750: '#242d3b',
            850: '#171d29',
        },
        red: {
            450: '#f25757',
        },
        green: {
            450: '#2fa862',
        },
    },
    styles: {
        global: () => ({
            body: {
                bg: '#f7f2f8',
                color: 'white',
            },
        }),
    },
    components: {
        Link: {
            baseStyle: {
                textDecoration: 'none !important',
            },
        },
    },
});
