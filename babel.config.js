export default {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
    'env': {
        'test': {
            'plugins': ['@babel/plugin-transform-modules-commonjs']
        }
    }
};