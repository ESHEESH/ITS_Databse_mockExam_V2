import { BookOpen, AlertTriangle, Target, Lightbulb } from 'lucide-react';

interface CategoryStats {
  [category: string]: {
    total: number;
    correct: number;
  };
}

interface CategorySuggestionsProps {
  categoryStats: CategoryStats;
}

const categoryResources: Record<string, { 
  description: string; 
  topics: string[];
  resources: string[];
}> = {
  'SQL': {
    description: 'Structured Query Language for database operations',
    topics: ['SELECT statements', 'JOIN operations', 'Subqueries', 'Aggregate functions'],
    resources: ['Practice JOIN operations', 'Learn GROUP BY and HAVING', 'Study subquery optimization']
  },
  'Database Fundamentals': {
    description: 'Core concepts of database systems',
    topics: ['Normalization', 'ACID properties', 'Data types', 'Constraints'],
    resources: ['Review 1NF, 2NF, 3NF', 'Understand primary and foreign keys', 'Practice data type selection']
  },
  'Database Design': {
    description: 'Designing efficient database schemas',
    topics: ['ER diagrams', 'Schema normalization', 'Relationship mapping', 'Denormalization'],
    resources: ['Draw ER diagrams', 'Practice identifying entities', 'Study cardinality']
  },
  'Data Retrieval': {
    description: 'Querying and extracting data efficiently',
    topics: ['Query optimization', 'Index usage', 'Filtering', 'Sorting'],
    resources: ['Practice complex queries', 'Learn execution plans', 'Study WHERE clause optimization']
  },
  'Database Manipulation': {
    description: 'Inserting, updating, and deleting data',
    topics: ['INSERT operations', 'UPDATE with conditions', 'DELETE safety', 'Transactions'],
    resources: ['Practice safe UPDATE patterns', 'Learn transaction isolation levels', 'Study rollback procedures']
  },
  'Database Object Management': {
    description: 'Creating and managing database objects',
    topics: ['Tables', 'Views', 'Indexes', 'Stored procedures'],
    resources: ['Practice CREATE TABLE', 'Learn view benefits', 'Study index types']
  },
  'Referential Integrity': {
    description: 'Maintaining data consistency across tables',
    topics: ['Foreign keys', 'Cascade operations', 'Constraints', 'Triggers'],
    resources: ['Practice CASCADE DELETE', 'Learn ON UPDATE behaviors', 'Study constraint types']
  },
  'Indexes': {
    description: 'Optimizing query performance with indexes',
    topics: ['Clustered indexes', 'Non-clustered indexes', 'Composite indexes', 'Index maintenance'],
    resources: ['Understand index selection', 'Practice covering indexes', 'Learn index maintenance']
  },
  'Keys': {
    description: 'Primary, foreign, and composite keys',
    topics: ['Primary keys', 'Foreign keys', 'Composite keys', 'Unique constraints'],
    resources: ['Practice key selection', 'Learn surrogate vs natural keys', 'Study key constraints']
  },
  'Security': {
    description: 'Database access control and protection',
    topics: ['Authentication', 'Authorization', 'Roles', 'Permissions'],
    resources: ['Practice GRANT and REVOKE', 'Learn role-based security', 'Study encryption']
  },
  'Backup': {
    description: 'Data protection and recovery strategies',
    topics: ['Full backups', 'Incremental backups', 'Point-in-time recovery', 'Disaster recovery'],
    resources: ['Practice backup strategies', 'Learn recovery procedures', 'Study backup automation']
  },
  'Constraints': {
    description: 'Enforcing data rules and validation',
    topics: ['NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT'],
    resources: ['Practice constraint creation', 'Learn CHECK constraints', 'Study constraint validation']
  },
  'DDL': {
    description: 'Data Definition Language for schema changes',
    topics: ['CREATE', 'ALTER', 'DROP', 'TRUNCATE'],
    resources: ['Practice ALTER TABLE', 'Learn safe DROP procedures', 'Study schema versioning']
  },
  'Joins': {
    description: 'Combining data from multiple tables',
    topics: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'],
    resources: ['Practice all join types', 'Learn join optimization', 'Study Cartesian products']
  },
  'Views': {
    description: 'Virtual tables for simplified access',
    topics: ['Creating views', 'Updatable views', 'Materialized views', 'View security'],
    resources: ['Practice view creation', 'Learn view limitations', 'Study indexed views']
  },
  'Stored Procedures': {
    description: 'Reusable database code blocks',
    topics: ['Creating procedures', 'Parameters', 'Error handling', 'Optimization'],
    resources: ['Practice procedure writing', 'Learn parameter types', 'Study error handling']
  },
  'Transactions': {
    description: 'Ensuring data consistency',
    topics: ['BEGIN/COMMIT/ROLLBACK', 'Isolation levels', 'Deadlocks', 'ACID properties'],
    resources: ['Practice transaction control', 'Learn isolation levels', 'Study deadlock prevention']
  },
  'Triggers': {
    description: 'Automated actions on data changes',
    topics: ['BEFORE/AFTER triggers', 'INSERT/UPDATE/DELETE triggers', 'Trigger recursion'],
    resources: ['Practice trigger creation', 'Learn trigger best practices', 'Study trigger performance']
  },
  'Functions': {
    description: 'Reusable database functions',
    topics: ['Scalar functions', 'Table-valued functions', 'Built-in functions', 'User-defined functions'],
    resources: ['Practice function creation', 'Learn built-in functions', 'Study function optimization']
  },
  'Data Types': {
    description: 'Choosing appropriate data types',
    topics: ['Numeric types', 'String types', 'Date/Time types', 'Binary types'],
    resources: ['Practice type selection', 'Learn storage implications', 'Study type conversions']
  }
};

export function CategorySuggestions({ categoryStats }: CategorySuggestionsProps) {
  // Calculate performance for each category
  const categoryPerformance = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    ...stats,
    percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  }));

  // Sort by performance (lowest first)
  const sortedCategories = categoryPerformance.sort((a, b) => a.percentage - b.percentage);
  
  // Get weak categories (below 70%)
  const weakCategories = sortedCategories.filter(c => c.percentage < 70 && c.total > 0);
  
  // Get strong categories (80% and above)
  const strongCategories = sortedCategories.filter(c => c.percentage >= 80 && c.total > 0);

  if (categoryPerformance.length === 0) {
    return (
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3 font-['Poppins'] flex items-center gap-2">
          <Target className="w-4 h-4" />
          Study Recommendations
        </h3>
        <p className="text-neutral-500 text-sm font-['Montserrat']">
          Complete the quiz to see personalized study recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weak Areas */}
      {weakCategories.length > 0 && (
        <div className="glass-card rounded-xl p-4 border-l-4 border-rose-500">
          <h3 className="text-rose-400 text-sm font-semibold uppercase tracking-wider mb-3 font-['Poppins'] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Areas to Improve
          </h3>
          <div className="space-y-3">
            {weakCategories.slice(0, 4).map((cat) => {
              const resource = categoryResources[cat.category] || {
                description: 'Database concept',
                topics: ['Core concepts'],
                resources: ['Review fundamentals']
              };
              
              return (
                <div key={cat.category} className="bg-neutral-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-amber-300 font-medium font-['Poppins'] text-sm">{cat.category}</span>
                    <span className="text-rose-400 text-xs font-['Montserrat']">{cat.percentage}%</span>
                  </div>
                  <p className="text-neutral-500 text-xs mb-2 font-['Montserrat']">{resource.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.topics.slice(0, 2).map((topic, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded font-['Montserrat']">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Study Tips */}
      <div className="glass-card rounded-xl p-4 border-l-4 border-amber-500">
        <h3 className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3 font-['Poppins'] flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Study Tips
        </h3>
        <div className="space-y-2">
          {weakCategories.slice(0, 2).map((cat) => {
            const resource = categoryResources[cat.category];
            if (!resource) return null;
            
            return (
              <div key={cat.category} className="text-sm">
                <p className="text-amber-300 font-medium font-['Poppins'] mb-1">{cat.category}:</p>
                <ul className="text-neutral-400 text-xs space-y-1 font-['Montserrat']">
                  {resource.resources.slice(0, 2).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strong Areas */}
      {strongCategories.length > 0 && (
        <div className="glass-card rounded-xl p-4 border-l-4 border-emerald-500">
          <h3 className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-3 font-['Poppins'] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Strong Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {strongCategories.slice(0, 4).map((cat) => (
              <span 
                key={cat.category} 
                className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-['Montserrat']"
              >
                {cat.category} ({cat.percentage}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
