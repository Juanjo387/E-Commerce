#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Counters for summary
total_tests=0
total_passed=0
total_failed=0
total_skipped=0

# Function to parse XML and get detailed test results using xmlstarlet
parse_test_results() {
    local output_file=$1

    # Extract all test case names
    test_cases=$(xmlstarlet sel -t -m '//testcase' -v '@name' -n "$output_file" 2>/dev/null)

    while IFS= read -r test_name; do
        # Check if the test case has a failure element
        if xmlstarlet sel -t -m "//testcase[@name='$test_name']/failure" -v '.' -n "$output_file" >/dev/null 2>&1; then
            local status="FAILED"
            local error_message=$(xmlstarlet sel -t -m "//testcase[@name='$test_name']/failure" -v '.' -n "$output_file" 2>/dev/null)
        # Check if the test case has a skipped element
        elif xmlstarlet sel -t -m "//testcase[@name='$test_name']/skipped" -v '.' -n "$output_file" >/dev/null 2>&1; then
            local status="SKIPPED"
            local error_message=""
        else
            local status="PASSED"
            local error_message=""
        fi

        case "$status" in
            FAILED)
                echo -e "Test Case: ${test_name} - ${RED}FAILED${NC}"
                echo -e "Error: ${RED}$error_message${NC}"
                total_failed=$((total_failed + 1))
                ;;
            SKIPPED)
                echo -e "Test Case: ${test_name} - ${YELLOW}SKIPPED${NC}"
                total_skipped=$((total_skipped + 1))
                ;;
            PASSED)
                echo -e "Test Case: ${test_name} - ${GREEN}PASSED${NC}"
                total_passed=$((total_passed + 1))
                ;;
        esac
        total_tests=$((total_tests + 1))
    done <<< "$test_cases"
}

# Check if tests array is provided as an argument
if [ -z "$1" ]; then
    echo -e "${RED}Error: No test array provided.${NC}"
    echo "Usage: $0 '[{\"test_command\":\"npm run test:task1\",\"test_output_path\":\"output/task_1.xml\",\"task_name\":\"task 1\"}, {...}]'"
    exit 1
fi

# Install xml utils
echo -e "${YELLOW}Running Testcases...${NC}"
sudo apt-get update > /dev/null 2>&1
sudo apt-get install -y xmlstarlet jq > /dev/null 2>&1

# Convert JSON-like string to bash-friendly format
while IFS= read -r test; do
    # Extract command, output path, and task name
    test_command=$(echo "$test" | jq -r '.test_command')
    test_output_path=$(echo "$test" | jq -r '.test_output_path')
    task_name=$(echo "$test" | jq -r '.task_name')
    
    # Run test command and allow output
    echo -e "${YELLOW}Running test cases for $task_name...${NC}"
    eval "$test_command"
    sleep 2
    # Parse the output file
    parse_test_results "$test_output_path"
    echo
done < <(echo "$1" | jq -c '.[]')

# Summary
echo -e "${YELLOW}Summary:${NC}"
echo -e "Total Test Cases: ${YELLOW}$total_tests${NC}"
echo -e "Total Passed: ${GREEN}$total_passed${NC}"
echo -e "Total Failed: ${RED}$total_failed${NC}"
echo -e "Total Skipped: ${YELLOW}$total_skipped${NC}"