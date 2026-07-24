import React from 'react';
import FeeStructureManager from '../components/FeeStructureManager';

export default function FeeStructuresPage({ 
  feeTypes, 
  waivers, 
  onCreateFeeType, 
  onDeactivateFeeType 
}) {
  return (
    <div className="fee-structures-page-wrapper">
      <FeeStructureManager 
        feeTypes={feeTypes}
        waivers={waivers}
        onCreateFeeType={onCreateFeeType}
        onDeactivateFeeType={onDeactivateFeeType}
      />
    </div>
  );
}
