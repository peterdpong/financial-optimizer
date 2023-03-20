import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Heading,
  HStack,
  ListItem,
  SimpleGrid,
  UnorderedList,
  VStack,
  Link,
} from "@chakra-ui/react";

import ProtectedRoute from "../../src/auth/ProtectedRoute";
import Sidebar from "../../components/app/Sidebar";
import { useAuth } from "../../src/auth/auth";
import { SuggestionEngine } from "../../src/engine/SuggestionEngine";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function SuggestionsPage() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  // SuggestionEngine.generateFinancialHealthSuggestions(userData);
  // SuggestionEngine.generateAllSpendingBudgetSuggestions(userData);
  SuggestionEngine.generateMoneyAllocationSuggestions(userData);

  return (
    <ProtectedRoute>
      <Sidebar>
        <Box bgColor="gray.100" padding="6" borderRadius="25">
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Heading size="lg" mr="2.5rem">
                Suggestions
              </Heading>
            </VStack>
          </HStack>
        </Box>

        <SimpleGrid columns={2} spacing={4}>
          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Spending and Budget Suggestions
            </Heading>
            <Accordion allowMultiple>
              {userData &&
                userData.suggestions["SpendingAndBudget"] &&
                userData.suggestions["SpendingAndBudget"].map(
                  (suggestion, index) => {
                    return (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Heading size={"sm"}>
                              {suggestion.suggestionTitle}
                            </Heading>
                          </Box>
                          <Badge colorScheme={suggestion.badgeColor}>
                            {suggestion.suggestionBadge}
                          </Badge>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4}>
                          {suggestion.suggestionDescription}
                          {suggestion.suggestionActions && (
                            <>
                              <br />
                              <Heading my={"1rem"} size={"sm"}>
                                Suggestions
                              </Heading>
                              <UnorderedList>
                                {suggestion.suggestionActions.map(
                                  (suggestion, index) => (
                                    <ListItem key={index}>
                                      {suggestion}
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            </>
                          )}
                          {suggestion.source && (
                            <Box my={"1rem"}>
                              <Heading size={"sm"}>
                                Further resources and sources
                              </Heading>
                              {suggestion.source.map((source, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={source.link}
                                    isExternal
                                    color={"blue.300"}
                                  >
                                    {source.linkTitle}{" "}
                                    <ExternalLinkIcon mx="2px" />
                                  </Link>
                                );
                              })}
                            </Box>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }
                )}
            </Accordion>
          </Box>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Money Allocation
            </Heading>
            <Accordion allowMultiple>
              {userData &&
                userData.suggestions["MoneyAllocation"] &&
                userData.suggestions["MoneyAllocation"].map(
                  (suggestion, index) => {
                    return (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Heading size={"sm"}>
                              {suggestion.suggestionTitle}
                            </Heading>
                          </Box>
                          <Badge colorScheme={suggestion.badgeColor}>
                            {suggestion.suggestionBadge}
                          </Badge>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4}>
                          {suggestion.suggestionDescription}
                          {suggestion.suggestionActions && (
                            <>
                              <br />
                              <Heading my={"1rem"} size={"sm"}>
                                Suggestions
                              </Heading>
                              <UnorderedList>
                                {suggestion.suggestionActions.map(
                                  (suggestion, index) => (
                                    <ListItem key={index}>
                                      {suggestion}
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            </>
                          )}
                          {suggestion.source && (
                            <Box my={"1rem"}>
                              <Heading size={"sm"}>
                                Further resources and sources
                              </Heading>
                              {suggestion.source.map((source, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={source.link}
                                    isExternal
                                    color={"blue.300"}
                                  >
                                    {source.linkTitle}{" "}
                                    <ExternalLinkIcon mx="2px" />
                                  </Link>
                                );
                              })}
                            </Box>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }
                )}
            </Accordion>
          </Box>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Goal and Savings
            </Heading>
            <Accordion allowMultiple>
              {userData &&
                userData.suggestions["GoalAndSavings"] &&
                userData.suggestions["GoalAndSavings"].map(
                  (suggestion, index) => {
                    return (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Heading size={"sm"}>
                              {suggestion.suggestionTitle}
                            </Heading>
                          </Box>
                          <Badge colorScheme={suggestion.badgeColor}>
                            {suggestion.suggestionBadge}
                          </Badge>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4}>
                          {suggestion.suggestionDescription}
                          {suggestion.suggestionActions && (
                            <>
                              <br />
                              <Heading my={"1rem"} size={"sm"}>
                                Suggestions
                              </Heading>
                              <UnorderedList>
                                {suggestion.suggestionActions.map(
                                  (suggestion, index) => (
                                    <ListItem key={index}>
                                      {suggestion}
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            </>
                          )}
                          {suggestion.source && (
                            <Box my={"1rem"}>
                              <Heading size={"sm"}>
                                Further resources and sources
                              </Heading>
                              {suggestion.source.map((source, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={source.link}
                                    isExternal
                                    color={"blue.300"}
                                  >
                                    {source.linkTitle}{" "}
                                    <ExternalLinkIcon mx="2px" />
                                  </Link>
                                );
                              })}
                            </Box>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }
                )}
            </Accordion>
          </Box>

          <Box
            bg={"gray.100"}
            rounded={"5px"}
            p={"20px"}
            width={"100%"}
            border={"1px"}
            borderColor={"gray.300"}
            my={"10px"}
          >
            <Heading size="md" my="10px">
              Financial Health
            </Heading>
            <Accordion allowMultiple>
              {userData &&
                userData.suggestions["FinancialHealth"] &&
                userData.suggestions["FinancialHealth"].map(
                  (suggestion, index) => {
                    return (
                      <AccordionItem key={index}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Heading size={"sm"}>
                              {suggestion.suggestionTitle}
                            </Heading>
                          </Box>
                          <Badge colorScheme={suggestion.badgeColor}>
                            {suggestion.suggestionBadge}
                          </Badge>
                          <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4}>
                          {suggestion.suggestionDescription}
                          {suggestion.suggestionActions && (
                            <>
                              <br />
                              <Heading my={"1rem"} size={"sm"}>
                                Suggestions
                              </Heading>
                              <UnorderedList>
                                {suggestion.suggestionActions.map(
                                  (suggestion, index) => (
                                    <ListItem key={index}>
                                      {suggestion}
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            </>
                          )}
                          {suggestion.source && (
                            <Box my={"1rem"}>
                              <Heading size={"sm"}>
                                Further resources and sources
                              </Heading>
                              {suggestion.source.map((source, index) => {
                                return (
                                  <Link
                                    key={index}
                                    href={source.link}
                                    isExternal
                                    color={"blue.300"}
                                  >
                                    {source.linkTitle}{" "}
                                    <ExternalLinkIcon mx="2px" />
                                  </Link>
                                );
                              })}
                            </Box>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  }
                )}
            </Accordion>
          </Box>
        </SimpleGrid>
      </Sidebar>
    </ProtectedRoute>
  );
}
