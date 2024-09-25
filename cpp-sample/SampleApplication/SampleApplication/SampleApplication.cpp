#include <iostream>
#include <vector>
#include <string>
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
    double areaValue = getCirlceArea(radius);
    float circumfValue = getCircumference(radius);
    std::cout << "The area result is: " << areaValue << std::endl;
    std::cout << "The circumference result is: " << circumfValue << "\n" << std::endl;
}

void showFixedArray()
{
    int arr1[5] = { 0 };
    std::cout << "The array is: " << arr1 << "\n" << std::endl;
}

void showDynamicArray()
{
    // 创建动态数组
    std::vector<int> dynArray(0);
    std::cout << "The dynamic array size of dynArray is: " << dynArray.size() << "\n" << std::endl;
    int inputValue = 0;
    std::cout << "Please input a number:" << std::endl;
    std::cin >> inputValue;
    dynArray.push_back(inputValue);
    std::cout << "The dynamic array size of dynArray is: " << dynArray.size() << "\n" << std::endl;
    std::cout << "Please input a number:" << std::endl;
    std::cin >> inputValue;
    dynArray.push_back(inputValue);
    std::cout << "The dynamic array size of dynArray is: " << dynArray.size() << "\n" << std::endl;
}

void showCPPSTDString()
{
    // 创建标准 C++ 字符串
    std::string title ("Hello World");
    std::cout << title << "\n" << std::endl;
}

int main()
{
    showAreaProgram();
    // showInputSumProgram();  
    showFixedArray();
    // showDynamicArray();
    showCPPSTDString();
    return 0;
}

