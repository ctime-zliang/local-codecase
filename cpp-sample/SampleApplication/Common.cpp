#include <iostream>

const double PI = 22.0 / 7;

constexpr double GET_DB_PI()
{
    return PI * 2
}

constexpr double GET_SQ_PI()
{
    return PI * PI;
}


double getArea(float radius)
{
    return PI * GET_SQ_PI();
}

int getSum(int a, int b)
{
    return a + b;
}
