import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { RootContext, RootContextType } from './RootContext';

export const renderWithMockProvider = (childen: ReactNode, providerProps: RootContextType) => {
    return render(
        <RootContext.Provider value={providerProps}>{childen}</RootContext.Provider>
    );
};
