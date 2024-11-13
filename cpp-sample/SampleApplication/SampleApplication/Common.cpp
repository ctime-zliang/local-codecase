#include <iostream>

/*
 * const 与指针
 *      int var = 0;
 *      int* const p = &var;  // 指针包含的地址为常量: 无法修改指针地址, 但可以修改指针地址指向的数据值
 *      const int* p = &var;  // 指针指向的数据为常量: 无法修改指针地址指向的数据值, 但可以修改指针地址
 *      const int* const p = &val;  // 指针包含的地址为常量且指针指向的数据为常量: 均不可修改
 */

#define PROHECT_NAME "Sample Application"

enum ECardinalDirections {
    North = 0,
    South,
    East,
    West,
};

const double PI = 22.0 / 7;

/*
 * 常量表达式
 * 可被编译器优化的常量表达式
 */
constexpr double PI_SQ()
{
    return PI * PI;
}

/*
 * 内联函数
 */
inline double GetPI()
{
    return 22.0 / 7;
}

double getCirlceArea(float radius)
{
    return PI * radius * radius;
}

float getCircumference(float radius)
{
    return PI * 2 * radius;
}

int getSum(int a, int b)
{
    return a + b;
}

int getFibNumber(int fibIndex)
{
    if (fibIndex < 2) 
    {
        return fibIndex;
    }
    return getFibNumber(fibIndex - 1) + getFibNumber(fibIndex - 2);
}
