import React from 'react';

export const CategoriesManagerView = ({ 
  categories, 
  newCategoryName, 
  setNewCategoryName, 
  onAddCategory, 
  onDeleteCategory 
}) => {
  return (
    <div className="p-6 max-w-xl mx-auto text-left space-y-6">
      
      {/* Category Creator Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 font-heading">Add New Category</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Category name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-800 dark:text-slate-200"
          />
          <button 
            onClick={onAddCategory}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Create
          </button>
        </div>
      </div>

      {/* Categories table list */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 font-heading">Primary Categories</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map(cat => (
            <div key={cat} className="py-2.5 flex justify-between items-center text-xs text-slate-700 dark:text-slate-350">
              <span className="font-semibold">{cat}</span>
              <button 
                onClick={() => onDeleteCategory(cat)}
                className="text-red-500 hover:text-red-600 font-bold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
