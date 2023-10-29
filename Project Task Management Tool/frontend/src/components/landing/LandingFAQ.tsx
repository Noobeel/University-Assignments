import React from 'react';
import { 
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';

export const LandingFAQ = () => {

    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            How much does it cost?
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    This software is free to use!
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box flex='2' textAlign='left'>
                            What development methodology is Dumpster Fire catered to?
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    Dumpster Fire is best suited for teams that use an agile framework.
                </AccordionPanel>
            </AccordionItem>
            
        </Accordion>
    );
};

