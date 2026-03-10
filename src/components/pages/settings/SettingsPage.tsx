"use client";

import { useState } from "react";
import { BankAccountForm } from "./BankAccountForm";
import { BankAccountsList } from "./BankAccountsList";
import { CategoryForm } from "./CategoryForm";
import { CategoriesList } from "./CategoriesList";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";

export function SettingsPage() {
  const [openCategory, setOpenCategory] = useState(false);
  const [openBank, setOpenBank] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex w-full flex-col gap-4 h-full">
        <Tabs defaultValue="categories" className="gap-4">
          <TabsList className="w-full justify-between rounded-2xl bg-muted">
            <TabsTrigger value="categories" className="flex-1 rounded-2xl">
              Categorías
            </TabsTrigger>
            <TabsTrigger value="bank-accounts" className="flex-1 rounded-2xl">
              Cuentas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold"></p>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl px-4 text-base"
                onClick={() => setOpenCategory(true)}
              >
                Agregar
              </Button>
            </div>

            <CategoriesList />

            <Drawer
              open={openCategory}
              onOpenChange={setOpenCategory}
              direction="bottom"
              autoFocus={false}
              repositionInputs={false}
            >
              <DrawerContent className="rounded-t-2xl overflow-hidden">
                <div className="flex h-full flex-col p-4">
                  <DrawerTitle className="text-base font-semibold">
                    Registrar nueva categoría
                  </DrawerTitle>
                  <div className="mt-4 flex-1 overflow-y-auto">
                    <CategoryForm onDone={() => setOpenCategory(false)} />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </TabsContent>

          <TabsContent value="bank-accounts" className="space-y-4 h-full">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold"></p>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl px-4 text-base"
                onClick={() => setOpenBank(true)}
              >
                Agregar
              </Button>
            </div>

            <BankAccountsList />

            <Drawer
              open={openBank}
              onOpenChange={setOpenBank}
              direction="bottom"
              autoFocus={false}
              repositionInputs={false}
            >
              <DrawerContent className="rounded-t-2xl overflow-hidden">
                <div className="flex h-full flex-col p-4">
                  <DrawerTitle className="text-base font-semibold">
                    Agregar cuenta
                  </DrawerTitle>
                  <div className="mt-4 flex-1 overflow-y-auto">
                    <BankAccountForm onDone={() => setOpenBank(false)} />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

