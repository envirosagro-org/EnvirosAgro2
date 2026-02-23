import math

def calculate_ca_growth(x, r, n):
  """
  Calculates the Agricultural Code (C(a)) for growth scenarios.
  
  Args:
    x: Agricultural base factor (scaled 1-10).
    r: Growth / Adoption rate.
    n: Number of periods.
  
  Returns:
    The calculated C(a) value.
  """
  if r == 1:
    return n * x + 1
  return x * ((r**n - 1) / (r - 1)) + 1

def calculate_ca_static(x, n):
  """
  Calculates the Agricultural Code (C(a)) for static adoption scenarios.

  Args:
    x: Agricultural base factor (scaled 1-10).
    n: Number of periods.

  Returns:
    The calculated C(a) value.
  """
  return n * x + 1

def calculate_m_constant(dn, In, ca, s):
  """
  Calculates the Sustainable Time Constant (m).

  Args:
    dn: Direct Nature Factor.
    In: Indirect Nature Factor.
    ca: Agricultural Code (C(a)).
    s: Crop Cycle Requirement.

  Returns:
    The calculated m-constant.
  """
  if s == 0:
    return float('inf') # Or handle as an error
  return math.sqrt((dn * In * ca) / s)
