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
 * 键盘输入两个数字
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
 * 计算区域面积
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
 * 键盘输入数字并修改数组成员
 * 输出数组成员
 */
void showFixedArray()
{
    // 定义类型数组并初始化成员值
    int arr1[5] = { 0 };
    std::cout << "The array memory address is: " << arr1 << std::endl;
    std::cout << "The arr1[1] is: " << arr1[1] << "\n" << std::endl;
    std::cout << "The arr1[1] used " << sizeof(arr1[1]) << " bytes\n" << std::endl;
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
    std::cout << "The mult-array arr1 memory address is: " << arr1 << std::endl;
    std::cout << "The arr1[1][1] is: " << arr1[1][1] << "\n" << std::endl;
    int arr2[3][3] = { 0 };
    std::cout << "The mult-array arr2 memory address is: " << arr2 << std::endl;
    std::cout << "The arr2[1][1] is: " << arr2[1][1] << "\n" << std::endl;
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
    dynArray[0] = 1001;
    std::cout << "The dynamic array size of dynArray is: " << dynArray.size() << "\n" << std::endl;
    int inputValue = 0;
    std::cout << "Please input a number:" << std::endl;
    std::cin >> inputValue;
    dynArray.push_back(inputValue);
    std::cout << "The dynamic array size of dynArray is: " << dynArray.size() << "\n" << std::endl;
    std::cout << "Please input a number:" << std::endl;
    std::cin >> inputValue;
    dynArray.push_back(inputValue);
    std::cout << "The dynamic array size of dynArray is: " << dynArray.size() << " bytes\n" << std::endl;
}

/*
 * 标准 C++ 字符串
 */
void showCPPSTDString()
{
    /*
     * 创建标准 C++ 字符串
     */
    std::string title ("Hello World, Standard C++ String.");
    std::cout << title << "\n" << std::endl;
    // std::string firstName;
    // std::string secondName;
    // std::cout << "Please input First-Name: " << std::endl;
    // std::cin >> firstName;
    // std::cout << "Please Second-Name: " << std::endl;
    // std::cin >> secondName;
    // std::string fullName = firstName + " " + secondName;
    // std::cout << "The full name is: " << fullName << "\n" << std::endl;
    // std::cout << "The full name used " << sizeof(fullName) << "\n" << std::endl;
}

void showEnumDefine()
{
    ECardinalDirections ThisDirection = South;
    std::cout << "The now direction is " << ThisDirection << "\n" << std::endl;
}

void forloopShowArray() 
{
    int arr1[] = { 0, 1, 2, 3, 4 };
    for (int item: arr1) 
    {
        std::cout << item << std::endl;
    }
    std::cout << "\n" << std::endl;
}

void showFibonacciNumbers()
{
    const int stepSize = 5;
    std::cout << "This program will calculate " << stepSize << " Fibonacci Numbers at a time" << std::endl;
    int num1 = 0;
    int num2 = 1;
    char tag = 'y';
    std::cout << num1 << " " << num2 << " ";
    while (tag == 'y')
    {
        for (int count = 0; count < stepSize; count++)
        {
            std::cout << num1 + num2 << " ";
            int tmp = num2;
            num2 = num1 + num2;
            num1 = tmp;
        }
        std::cout << "Do you want more numbers(y / n) ?";
        std::cin >> tag;
    }
    std::cout << "Program end!" << "\n" << std::endl;
}

void showFibNumber()
{
    int inputNumber = 0;
    std::cout << "Input index for Fib-Number: " << std::endl;
    std::cin >> inputNumber;
    std::cout << "The result is: " << getFibNumber(inputNumber) << "\n" << std::endl;
}

void pointHandle()
{
    int age = 18;
    int* p = &age;
    *p = 28;
    std::cout << "The <Int>age value is: " << age << "\n" << std::endl;
}

void dynamicMemory()
{
    int* p = new int;
    std::cout << "Input a number:" << std::endl;
    std::cin >> *p;
    std::cout << "The number of you input is: " << *p << std::endl;
    std::cout << "will clear memory!" << std::endl;
    delete p;
}

int main()
{
    showAreaProgram();
    // showInputSumProgram();
    // showFixedArray();
    // showDynamicArray();
    // showMultidimenArray();
    showCPPSTDString();
    // showEnumDefine();
    // forloopShowArray();
    // showFibonacciNumbers();
    // showFibNumber();
    // pointHandle();
    // dynamicMemory();
    return 0;
}

