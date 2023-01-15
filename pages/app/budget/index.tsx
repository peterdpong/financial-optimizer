import { Box, Heading, HStack, VStack } from "@chakra-ui/react";
import Sidebar from "../../../components/app/Sidebar";
import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import BudgetOverview from "./BudgetOverview";

export default function BudgetPage() {
  return (
    <ProtectedRoute>
      <Sidebar>
        <Box bgColor="gray.100" padding="6" borderRadius="25">
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Budget
              </Heading>
            </VStack>
          </HStack>
        </Box>
        <Box rounded={"5px"} px={"0px"}></Box>
        <BudgetOverview />
      </Sidebar>
    </ProtectedRoute>
  );
}
