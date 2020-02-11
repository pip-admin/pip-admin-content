module.exports = {
    module: {
        name: 'pipAdminContent',
        styles: 'index',
        export: 'pip.admin.content',
        standalone: 'pip.admin.content'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    file: {
        lib: [
            '../node_modules/pip-webui-all/dist/**/*',
            '../pip-admin-shell/dist/**/*',
            '../node_modules/pip-suite-all/dist/**/*',
        ]
    },
    samples: {
        port: 8380,
        https: false
    },
    api: {
        port: 8381
    }
};
