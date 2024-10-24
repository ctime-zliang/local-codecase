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

/*
 * 输入两个数字
 * 求和
 * 输出
 */
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

/*
 * 求区域面积
 * 输出
 */
void showAreaProgram()
{
    const float radius = 5.0;
    double areaValue = getCirlceArea(radius);
    float circumfValue = getCircumference(radius);
    std::cout << "The area result is: " << areaValue << std::endl;
    std::cout << "The circumference result is: " << circumfValue << "\n" << std::endl;
}

/*
 * 输出数组内存地址
 * 输入数字并修改数组成员
 * 输出
 */
void showFixedArray()
{
    // 定义类型数组并初始化成员值
    int arr1[5] = { 0 };
    std::cout << "The array memory address is: " << arr1 << std::endl;
    std::cout << "The array[1] is: " << arr1[1] << "\n" << std::endl;
    // std::cout << "Please input a value to set array[1]" << std::endl;
    // std::cin >> arr1[1];
    // std::cout << "The changed array[1] is: " << arr1[1] << "\n" << std::endl;
}

/*
 * 多维数组
 */
void showMultidimenArray()
{
    int arr1[3][3] = { 0, 1, 2, 3, 4, 5 };
    std::cout << "The muilt-array memory address is: " << arr1 << std::endl;
    std::cout << "The array[1][1] is: " << arr1[1][1] << "\n" << std::endl;
}

/*
 * 动态数组
 */
void showDynamicArray()
{
    /*
     * 创建动态数组
     * 初始化数组长度为 0
     */
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
    /*
     * 创建标准 C++ 字符串
     */
    std::string title ("Hello World");
    std::cout << title << "\n" << std::endl;
}

void showEnumDefine()
{
    ECardinalDirections ThisDirection = South;
    std::cout << "The now direction is " << ThisDirection << "\n" << std::endl;
}

int main()
{
    showAreaProgram();
    // showInputSumProgram();  
    showFixedArray();
    // showDynamicArray();
    showMultidimenArray();
    showCPPSTDString();
    showEnumDefine();
    return 0;
}

