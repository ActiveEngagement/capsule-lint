export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(html-chunk)/)'
    ]
};