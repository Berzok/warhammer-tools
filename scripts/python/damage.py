#coding: utf-8
import random
random.seed()


A = 5   # Nombre d'attaques par round
CC = 79 # Capacité de combat
F = 64  # Force
BF = 6  # Bonus de Force

total_damage = 0


def ulric_fury(base_damage):
  print "ULRIC'S FURY!"
  damage_dice = random.randint(1, 10)
  damage_dice2 = random.randint(1, 10)
  damage_dice = max(damage_dice, damage_dice2)
  if(damage_dice == 10):
    base_damage += damage_dice
    return ulric_fury(base_damage)
  else:
    base_damage += damage_dice
    return base_damage


for i in range(A):
  score = random.randint(1, 100)
  if(score <= CC):
    damage_dice = random.randint(1, 10)
    damage_dice2 = random.randint(1, 10)
    damage_dice = max(damage_dice, damage_dice2)
    if(damage_dice == 10):
      damage_dice = ulric_fury(damage_dice)
    attack_damage = damage_dice + 1 + BF
  else:
    attack_damage = 0
  total_damage += attack_damage
  print '[#'+str(i)+' Attack]:'
  print 'CC Score: ' + str(score)
  print 'Total damage: ' + str(attack_damage) + '\n'

print '\n Total damage for the round: ' + str(total_damage)