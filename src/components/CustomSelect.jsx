import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select option', 
  icon: LeadIcon,
  style = {} 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="custom-select-container" 
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {/* Trigger Button */}
      <button 
        type="button"
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {LeadIcon && <LeadIcon size={15} className="custom-select-lead-icon" />}
        <span className="custom-select-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={15} className={`custom-select-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="custom-select-menu">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div 
                key={option.value} 
                className={`custom-select-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {option.icon && <option.icon size={14} style={{ color: 'var(--odoo-purple)' }} />}
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check size={14} style={{ color: 'var(--odoo-purple)' }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
