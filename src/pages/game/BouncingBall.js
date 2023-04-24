import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import BouncingBallsGame from "../components/BouncingBallsGame";

const BouncingBall = () => {
    return (
        <>
            <Box minH="100vh">
                <BouncingBallsGame />
            </Box>
        </>
    );
};

export default BouncingBall;
