 ifnconst bankswitchmode
   if ( * < $f000 )
     ORG $F000
   endif
 else
     ifconst ROM128K
       if ( * < $f000 )
         ORG $27000
         RORG $F000
       endif
     endif
     ifconst ROM144K
       if ( * < $f000 )
         ORG $27000
         RORG $F000
       endif
     endif
    ifconst ROM256K
       if ( * < $f000 )
         ORG $47000
         RORG $F000
       endif
     endif
    ifconst ROM272K
       if ( * < $f000 )
         ORG $47000
         RORG $F000
       endif
     endif
    ifconst ROM512K
       if ( * < $f000 )
         ORG $87000
         RORG $F000
       endif
     endif
    ifconst ROM528K
       if ( * < $f000 )
         ORG $87000
         RORG $F000
       endif
     endif
 endif

 ; all of these "modules" have conditional clauses in them, so even though
 ; they're always included here, they don't take up rom unless the user
 ; explicitly enables support for the feature.

 ifnconst included.7800vox.asm
     include 7800vox.asm
 endif
 ifnconst included.pokeysound.asm
     include pokeysound.asm
 endif
 ifnconst included.tracker.asm
     include tracker.asm
 endif
 ifnconst included.hiscore.asm
     include hiscore.asm
 endif
