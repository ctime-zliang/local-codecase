#include <iostream>

#define PROHECT_NAME "Sample Application"

const double PI = 22.0 / 7;

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
