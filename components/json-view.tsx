'use client';

import { ChevronDown, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

interface JsonViewProps {
  data: unknown;
  initialExpanded?: boolean;
}

export function JsonView({ data, initialExpanded = true }: JsonViewProps) {
  const [globalExpanded, setGlobalExpanded] = useState(initialExpanded);
  const [key, setKey] = useState(0); // Used to force re-render when toggling all

  const toggleAll = () => {
    setGlobalExpanded(!globalExpanded);
    setKey(prev => prev + 1); // Force re-render with new key
  };

  return (
    <div className="font-mono text-sm">
      <div className="mb-3 flex items-center gap-2 border-b pb-2 dark:border-gray-700">
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
          title={globalExpanded ? 'Collapse all' : 'Expand all'}
        >
          {globalExpanded ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </>
          )}
        </button>
        <span className="text-xs text-gray-500">
          {typeof data === 'object' &&
            data !== null &&
            (Array.isArray(data)
              ? `Array (${data.length} items)`
              : `Object (${Object.keys(data).length} properties)`)}
        </span>
      </div>
      <JsonNode
        key={key}
        data={data}
        indent={0}
        initialExpanded={globalExpanded}
      />
    </div>
  );
}

interface JsonNodeProps {
  data: unknown;
  indent: number;
  propertyName?: string;
  initialExpanded?: boolean;
}

function JsonNode({
  data,
  indent,
  propertyName,
  initialExpanded = true,
}: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const indentStyle = { paddingLeft: `${indent * 16}px` };

  // Handle null
  if (data === null) {
    return (
      <div style={indentStyle}>
        {propertyName && (
          <span className="text-purple-600 dark:text-purple-400">
            &quot;{propertyName}&quot;
          </span>
        )}
        {propertyName && ': '}
        <span className="text-gray-500">null</span>
      </div>
    );
  }

  // Handle undefined
  if (data === undefined) {
    return (
      <div style={indentStyle}>
        {propertyName && (
          <span className="text-purple-600 dark:text-purple-400">
            &quot;{propertyName}&quot;
          </span>
        )}
        {propertyName && ': '}
        <span className="text-gray-500">undefined</span>
      </div>
    );
  }

  // Handle primitive types
  if (typeof data !== 'object') {
    return (
      <div style={indentStyle}>
        {propertyName && (
          <span className="text-purple-600 dark:text-purple-400">
            &quot;{propertyName}&quot;
          </span>
        )}
        {propertyName && ': '}
        {typeof data === 'string' ? (
          <span className="text-green-600 dark:text-green-400">
            &quot;{data}&quot;
          </span>
        ) : typeof data === 'number' ? (
          <span className="text-blue-600 dark:text-blue-400">{data}</span>
        ) : typeof data === 'boolean' ? (
          <span className="text-orange-600 dark:text-orange-400">
            {data.toString()}
          </span>
        ) : (
          <span>{String(data)}</span>
        )}
      </div>
    );
  }

  // Handle arrays
  if (Array.isArray(data)) {
    const isEmpty = data.length === 0;

    if (isEmpty) {
      return (
        <div style={indentStyle}>
          {propertyName && (
            <span className="text-purple-600 dark:text-purple-400">
              &quot;{propertyName}&quot;
            </span>
          )}
          {propertyName && ': '}
          <span className="text-gray-600 dark:text-gray-400">[]</span>
        </div>
      );
    }

    return (
      <div>
        <div style={indentStyle} className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {propertyName && (
            <>
              <span className="text-purple-600 dark:text-purple-400">
                &quot;{propertyName}&quot;
              </span>
              <span>: </span>
            </>
          )}
          <span className="text-gray-600 dark:text-gray-400">[</span>
          {!isExpanded && (
            <span className="text-gray-500 text-xs mx-1">
              {data.length} {data.length === 1 ? 'item' : 'items'}
            </span>
          )}
          {!isExpanded && (
            <span className="text-gray-600 dark:text-gray-400">]</span>
          )}
        </div>
        {isExpanded && (
          <>
            <div>
              {data.map((item, index) => (
                <div key={index} className="relative">
                  {typeof item === 'object' && item !== null ? (
                    <JsonNode
                      data={item}
                      indent={indent + 1}
                      propertyName={`${index}`}
                      initialExpanded={initialExpanded}
                    />
                  ) : (
                    <div style={{ paddingLeft: `${(indent + 1) * 16}px` }}>
                      <span className="text-gray-500">{index}</span>
                      {': '}
                      {typeof item === 'string' ? (
                        <span className="text-green-600 dark:text-green-400">
                          &quot;{item}&quot;
                        </span>
                      ) : typeof item === 'number' ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          {item}
                        </span>
                      ) : typeof item === 'boolean' ? (
                        <span className="text-orange-600 dark:text-orange-400">
                          {item.toString()}
                        </span>
                      ) : item === null ? (
                        <span className="text-gray-500">null</span>
                      ) : (
                        <span>{String(item)}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={indentStyle}>
              <span className="text-gray-600 dark:text-gray-400">]</span>
            </div>
          </>
        )}
      </div>
    );
  }

  // Handle objects
  const keys = Object.keys(data as Record<string, unknown>);
  const isEmpty = keys.length === 0;

  if (isEmpty) {
    return (
      <div style={indentStyle}>
        {propertyName && (
          <span className="text-purple-600 dark:text-purple-400">
            &quot;{propertyName}&quot;
          </span>
        )}
        {propertyName && ': '}
        <span className="text-gray-600 dark:text-gray-400">{'{}'}</span>
      </div>
    );
  }

  return (
    <div>
      <div style={indentStyle} className="flex items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-0.5"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {propertyName && (
          <>
            <span className="text-purple-600 dark:text-purple-400">
              &quot;{propertyName}&quot;
            </span>
            <span>: </span>
          </>
        )}
        <span className="text-gray-600 dark:text-gray-400">{'{'}</span>
        {!isExpanded && (
          <span className="text-gray-500 text-xs mx-1">
            {keys.length} {keys.length === 1 ? 'property' : 'properties'}
          </span>
        )}
        {!isExpanded && (
          <span className="text-gray-600 dark:text-gray-400">{'}'}</span>
        )}
      </div>
      {isExpanded && (
        <>
          <div>
            {keys.map(key => (
              <JsonNode
                key={key}
                data={(data as Record<string, unknown>)[key]}
                indent={indent + 1}
                propertyName={key}
                initialExpanded={initialExpanded}
              />
            ))}
          </div>
          <div style={indentStyle}>
            <span className="text-gray-600 dark:text-gray-400">{'}'}</span>
          </div>
        </>
      )}
    </div>
  );
}
