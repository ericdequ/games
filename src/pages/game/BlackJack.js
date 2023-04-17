import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import BlackJackComp from "../components/BlackJackComp";

const BlackJack = () => {
    return (
        <>
            <Box minH="100vh">
                <BlackJackComp />
            </Box>
        </>
    );
};

export default BlackJack;
