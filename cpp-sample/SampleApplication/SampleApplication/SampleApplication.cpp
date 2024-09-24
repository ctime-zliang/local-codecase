#include <iostream>
#include "./Common.cpp"

/*
* std::cout << "output a value: " << 12 << std::endl;
*/

/************************************************************************************************/
/************************************************************************************************/
/************************************************************************************************/

void showInputSumProgram()
{
    int inputA = 0;
    int inputB = 0;
    std::cout << "Please input A number:" << std::endl;
    std::cin >> inputA;
    std::cout << "Please input B number:" << std::endl;
    std::cin >> inputB;
    int sumValue = getSum(inputA, inputB);
    std::cout << "The sum result of inputA and inputB is: " << sumValue << "\n" << std::endl;
}

void showAreaProgram()
{
    const float radius = 5.0;
    double areaValue = getArea(radius);
    std::cout << "The area result is: " << areaValue << "\n" << std::endl;
}

int main()
{
    showAreaProgram();
    showInputSumProgram();    
    return 0;
}

