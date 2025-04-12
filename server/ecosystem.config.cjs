module.exports = {
  apps: [
    {
      name: 'ytmate-backend',
      script: './dist/index.js',
      watch: true,
      node_args: [
        '-r',
        './node_modules/dotenv/config',
        '--experimental-modules',
        '--experimental-json-modules',
      ],
      timestamp: 'HH:mm Z DD-MM-YYYY',
      ignore_watch: ['node_modules', 'uploads'],
    },
  ],
}
