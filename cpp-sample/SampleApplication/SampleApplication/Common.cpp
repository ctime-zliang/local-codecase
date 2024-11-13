#include <iostream>

/*
 * const ��ָ��
 *      int var = 0;
 *      int* const p = &var;  // ָ������ĵ�ַΪ����: �޷��޸�ָ���ַ, �������޸�ָ���ַָ�������ֵ
 *      const int* p = &var;  // ָ��ָ�������Ϊ����: �޷��޸�ָ���ַָ�������ֵ, �������޸�ָ���ַ
 *      const int* const p = &val;  // ָ������ĵ�ַΪ������ָ��ָ�������Ϊ����: �������޸�
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
 * �������ʽ
 * �ɱ��������Ż��ĳ������ʽ
 */
constexpr double PI_SQ()
{
    return PI * PI;
}

/*
 * ��������
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
