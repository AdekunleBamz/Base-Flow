'use client';

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index < currentStep ? 'bg-green-500' : index === currentStep ? 'bg-blue-500' : 'bg-slate-700'}
                transition-all duration-300
              `}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className="text-white text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <p className={`text-xs mt-1 ${index <= currentStep ? 'text-white' : 'text-slate-500'}`}>
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-slate-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepIndicator;
