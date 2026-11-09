import { MealPlanDay } from '../types';

export const THIRTY_DAY_MEAL_PLAN: MealPlanDay[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const breakfastIds = ['recipe-2', 'recipe-18', 'recipe-14', 'recipe-24', 'recipe-33', 'recipe-38'];
  const lunchIds = ['recipe-1', 'recipe-6', 'recipe-5', 'recipe-11', 'recipe-16', 'recipe-17'];
  const dinnerIds = ['recipe-3', 'recipe-4', 'recipe-7', 'recipe-8', 'recipe-9', 'recipe-12', 'recipe-13'];

  return {
    day,
    dayName: `Day ${day}`,
    breakfastId: breakfastIds[(day - 1) % breakfastIds.length],
    lunchId: lunchIds[(day - 1) % lunchIds.length],
    dinnerId: dinnerIds[(day - 1) % dinnerIds.length]
  };
});
