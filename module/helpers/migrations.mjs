const MIGRATIONS = [
    {
        property: 'data.data.health',
        state: 'present',
        initial: {
            max: 6,
            min: 6,
            value: 6
        }
    }
]


export const migrateWorld = async function () {
    ui.notifications.info(game.i18n.format("MIGRATION.Begin"), {permanent: false});

    for (let a of game.actors) {
        let updateData = {}

        for(let migration of MIGRATIONS) {
            if (migration.state === 'overridden' || (migration.state === 'present' && getDescendantProp(a, migration.property) === undefined)) {
                let arr = migration.property.split('.')
                updateData[arr[arr.length - 1]] = migration.initial
            }
        }

        if (!foundry.utils.isObjectEmpty(updateData)) {
            console.log(`Migrating Actor document ${a.name}`);
            console.log(updateData)
            await a.update(updateData, {enforceTypes: false});
        }
    }

    ui.notifications.info(game.i18n.format("MIGRATION.End"), {permanent: false});
}

function getDescendantProp(obj, desc) {
    let arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()])) ;
    return obj;
}