#include <iostream>

#define PROHECT_NAME "Sample Application"

enum ECardinalDirections {
    North = 0,
    South,
    East,
    West,
};

const double PI = 22.0 / 7;

/*
 * �������ʽ
 * �ɱ��������Ż��ĳ������ʽ
 */
constexpr double PI_SQ()
{
    return PI * PI;
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
